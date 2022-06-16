import * as vscode from "vscode";
import * as fs from "fs";
import { ResultJSON } from "./json";

export class Replace {
    constructor(
        public replaceLanguage: string,
        public resultJSON: ResultJSON,
    ) {
    }

    // replace language syntax check
    parse(): ReplaceInfo[] {
        const replaceLines = this.splitIntoLines();
        let result: ReplaceInfo[] = [];
        replaceLines.forEach((line, idx, array) => {
            // TODO: 替换语言检查：
            // 1. 左部和右部label相等
            // TODO: 2. label在范围内
            // TODO: 3. index在范围内
            // !: 假设: 左右的index要么同时存在，要么同时不存在
            // !: 假设: 输入没有语法错误

            console.log(line);

            const nums = line.match(/\d+/g);
            const isPattern2 = line.match(/""".+"""/g);
            const withIndex = line.match(/\[\d+.\d+\]/g);
            const pattern2WithPrev = line.match(/->\[\d+/g);
            const pattern2WithPost = line.match(/\d+\]$/g);
            let label = [-1, -1, -1], index = [-1, -1, -1];
            let text = "";
            if (withIndex) {// 有index
                if (nums === null) { return []; }
                label[0] = parseInt(nums[0]);
                index[0] = parseInt(nums[1]);
                if (!isPattern2 || pattern2WithPrev) {
                    label[1] = parseInt(nums[2]);
                    index[1] = parseInt(nums[3]);
                } else if (pattern2WithPost) {
                    label[2] = parseInt(nums[nums.length - 2]);
                    index[2] = parseInt(nums[nums.length - 1]);
                }
            } else {// 无index
                if (nums === null) { return []; }
                label[0] = parseInt(nums[0]);
                if (!isPattern2 || pattern2WithPrev) {
                    label[1] = parseInt(nums[1]);
                } else if (pattern2WithPost) {
                    label[2] = parseInt(nums[nums.length - 1]);
                }
            }
            if (isPattern2) {
                text = [...isPattern2][0];
                text = text.substring(3, text.length - 3);
            }
            console.log(label);
            
            if (!((label[1] === -1 || label[0] === label[1]) &&
                  (label[2] === -1 || label[0] === label[2]))) {
                throw new Error((idx + 1) + "-th: Replace Language Left and Right label must be consistent.");
            }
            result.push(new ReplaceInfo(label, index, text));
        });
        // return result;
        return result.sort((a: ReplaceInfo, b: ReplaceInfo) => {
            return a.label[0] < b.label[0] ? 1 : -1;
        });
    }

    public execReplace() {
        let replaceInfo;
        try {
            replaceInfo = this.parse();
        } catch (error) {
            throw error;
        }
        let result: string = "";
        for (const iterator of this.resultJSON.results) {
            const path = iterator.path;
            const source = fs.readFileSync(path).toString();
            let pos = 0;
            let result = ""; 

            console.log(source);
            

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
                    if (info.label[1] !== -1) {
                        const prevLabel = info.label[1];
                        const prevIndex = info.index[1];
                        console.log("here1");
                        const targetPosition = prevIndex === -1 ?
                            iterator.path_res[prevLabel].label_res[depth].position :
                            iterator.path_res[prevLabel].label_res[depth].subNode[prevIndex];
                        console.log("here2");
                        replaceString += source.substring(targetPosition.si, targetPosition.ei);
                    }
                    // 第二部分, 文本
                    replaceString += info.text;
                    // 第三部分
                    if (info.label[2] !== -1) {
                        const postLabel = info.label[2];
                        const postIndex = info.index[2];
                        const targetPosition = postIndex === -1 ?
                            iterator.path_res[postLabel].label_res[depth].position :
                            iterator.path_res[postLabel].label_res[depth].subNode[postIndex];
                        replaceString += source.substring(targetPosition.si, targetPosition.ei);
                    }

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
                console.log("[callback] " + path + " write success");
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
        public text: string,
    ) {
    }
}
