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
            if (line.match(/\[\d+(\.\d+)?\]=>(""".*""")?(##)?(\[\d+(\.\d+)?\])?(##)?(""".*""")?/g) === null) {
                throw new Error((idx + 1) + "-th: Replace Language mismatches pattern.");
            }
            // TODO: 替换语言检查：
            // 1. 左部和右部label相等
            // TODO: 2. label在范围内
            // TODO: 3. index在范围内

            let label = [-1, -1], index = [-1, -1];
            let text = ["", ""];

            const parts = line.split(/=>|"""|##|\[|\]/g).filter(s => s && s.trim());
            const partsFill: string[] = [];
            let cnt = 0;
            for (let i = 0; i < 4; i++) {
                if (cnt < parts.length && (i % 2 === 0) === (!isNaN(Number(parts[cnt])))) {
                    partsFill.push(parts[cnt++]);
                } else {
                    partsFill.push("");
                }
            }
            console.log(partsFill);

            getLabelAndIndex(0, 0);
            text[0] = partsFill[1];
            getLabelAndIndex(1, 2);
            text[1] = partsFill[3];
            

            function getLabelAndIndex(idx: number, i: number) {
                const nums = partsFill[i].split(".");
                label[idx] = parseInt(nums[0]);
                if (nums.length > 1) {
                    index[idx] = parseInt(nums[1]);
                }
            }
            
            const info = new ReplaceInfo(label, index, text);
            console.log(info);

            if (!(label[1] === -1 || label[0] === label[1])) {
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
                    const position = leftIndex === -1 ?
                        iterator.path_res[leftLabel].label_res[depth].position :// 输入无index
                        iterator.path_res[leftLabel].label_res[depth].subNode[leftIndex];// 输入有index

                    let replaceString = "";// 替换区域字符串
                    // 第一部分
                    replaceString += info.text[0];
                    // 第二部分
                    if (info.label[1] !== -1) {
                        const prevLabel = info.label[1];
                        const prevIndex = info.index[1];
                        const targetPosition = prevIndex === -1 ?
                        iterator.path_res[prevLabel].label_res[depth].position :
                        iterator.path_res[prevLabel].label_res[depth].subNode[prevIndex];
                        replaceString += source.substring(targetPosition.si, targetPosition.ei);
                    }
                    // 第三部分
                    replaceString += info.text[1];

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
        this.replaceLanguage = [...this.replaceLanguage.matchAll(/[^\s"]+|"""[^"]*"""/g)].join("");
        const replaceLines = this.replaceLanguage.split("$");
        replaceLines.pop();
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
