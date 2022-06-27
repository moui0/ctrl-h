import * as fs from "fs";
import * as vscode from "vscode";
import { ResultJSON } from "./json";

export class Replace {
    constructor(
        public replaceLanguage: string,
        public resultJSON: ResultJSON,
    ) {
    }

    // replace language syntax check
    parse(): ReplaceInfo[] | undefined {
        if (this.replaceLanguage.replace(/\s/g, "") === "") {
            return undefined;
        }
        const replaceLines = this.splitIntoLines();
        let result: ReplaceInfo[] = [];
        replaceLines.forEach((line, idx, array) => {
            const regex = /\[(?<label0>\d+)(\.(?<index0>\d+))?\]=>("""(?<text0>.*?)""")?(##)?(\[(?<label1>\d+)(\.(?<index1>\d+))?\])?(##)?("""(?<text1>.*?)""")?/g;
            let matches = regex.exec(line);
            if (matches === null || matches.groups === undefined) {
                throw new Error((idx + 1) + "-th: Replace Language mismatches pattern.");
            }

            const label = [Number.parseInt(matches.groups.label0), Number.parseInt(matches.groups.label1)];
            const index = [Number.parseInt(matches.groups.index0), Number.parseInt(matches.groups.index1)];
            const text = [matches.groups.text0, matches.groups.text1];

            const info = new ReplaceInfo(label, index, text);
            console.log(info);

            if (!isNaN(label[1]) && label[0] !== label[1]) {
                throw new Error((idx + 1) + "-th: Replace Language Left and Right label must be consistent.");
            }

            result.push(info);
        });

        return result.sort((a: ReplaceInfo, b: ReplaceInfo) => {
            if (a.label[0] < b.label[0]) {
                return -1;
            } else if (a.label[0] === b.label[0]) {
                return a.index[0] < b.index[0] ? -1 : 1;
            } else {
                return 1;
            }
        });
    }

    public execReplace() {
        let replaceInfo;
        try {
            replaceInfo = this.parse();
        } catch (error) {
            throw error;
        }
        if (replaceInfo === undefined) {
            return;
        }
        if (replaceInfo.length === 0) {
            throw new Error("Invaild Replace Language.");
        }
        
        for (const iterator of this.resultJSON.results) {
            const path = iterator.path;
            const source = fs.readFileSync(path).toString();
            let pos = 0;
            let result = ""; 

            // 遍历label的深度, 各label深度应该是相同的
            // 计算最大深度, 假设label的索引 == label
            const maxDepth = iterator.path_res[replaceInfo[0].label[0]].label_res.length;
            
            for (let depth = 0; depth < maxDepth; depth++) {
                // 遍历左部
                for (const info of replaceInfo) {
                    const leftLabel = info.label[0];
                    const leftIndex = info.index[0];
                    
                    const position = isNaN(leftIndex) ?
                        iterator.path_res[leftLabel].label_res[depth].position :// 输入无index
                        iterator.path_res[leftLabel].label_res[depth].subNode[leftIndex];// 输入有index

                    let replaceString = "";// 替换区域字符串
                    // 第一部分
                    replaceString += info.text[0] === undefined ? "" : info.text[0];
                    // 第二部分
                    if (!isNaN(info.label[1])) {
                        const prevLabel = info.label[1];
                        const prevIndex = info.index[1];
                        console.log(5);
                        
                        const targetPosition = isNaN(prevIndex) ?
                            iterator.path_res[prevLabel].label_res[depth].position :
                            iterator.path_res[prevLabel].label_res[depth].subNode[prevIndex];
                        console.log(6);
                        
                        replaceString += source.substring(targetPosition.si, targetPosition.ei);
                    }
                    // 第三部分
                    replaceString += info.text[1] === undefined ? "" : info.text[1];

                    // 替换区域之前
                    result += source.substring(pos, position.si);
                    // 替换区域
                    result += replaceString;
                    // 替换区域之后
                    pos = position.ei;
                }
            }
            // 最后还剩下的一段
            result += source.substring(pos);
            // TODO: result 写回到文件
            fs.writeFile(path, result, (err) => { 
                if (err) {
                    console.log(err);
                    return;
                }
                vscode.window.showInformationMessage(path + " replace success");
            });
        }
    }

    splitIntoLines() {
        this.replaceLanguage = this.replaceLanguage.replace(/\n/g, "");
        this.replaceLanguage = [...this.replaceLanguage.matchAll(/""".*?"""|[^(\s|""")]+/g)].join("");
        const replaceLines = this.replaceLanguage.split("$");
        return replaceLines;
    }
}

class ReplaceInfo {
    constructor(
        public label: number[],
        public index: number[],
        public text: string[],
    ) {
    }
}
