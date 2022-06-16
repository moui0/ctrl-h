import * as vscode from 'vscode';
import { runHander } from "./runtime";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("ctrl-h-webview", () => {
        const panel = vscode.window.createWebviewPanel(
            "ctrl-h",
            "Ctrl-H",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
            }
        );
        panel.webview.html = getWebViewContent();
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case "run":
                    const targetLanguage = message.text.targetLanguage;
                    const path = message.text.path;
                    const queryLanguage = message.text.queryLanguage;
                    const replaceLanguage = message.text.replaceLanguage;
                    panel.dispose();
                    runHander(
                        targetLanguage,
                        "/home/why/Java/src/org/antlr/v4/runtime/Lexer.java",
                        queryLanguage,
                        replaceLanguage,
                    );
                    break;
                // TODO: 异常处理
                default:
                    break;
            }
        });
        panel.onDidDispose(
            () => {

            },
            null,
        );
    });
}

// this method is called when your extension is deactivated
export function deactivate() { }

function getWebViewContent() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ctrl-H</title>
    <style>
        body {
            background-color: white;
        }
        .all {
            width: 500px;
            margin: 20px auto;
        }
        label {
            display: block;
            margin-bottom: 10px;
        }
        div {
            margin-top: 20px;
        }
        input:hover {
            border-color: #0e639c;
        }
        #run {
            background-color: #0e639c;
            color: white;
            width: 100px;
            height: 40px;
            border: #0e639c solid;
            border-radius: 5px;
        }

    </style>
</head>

<body>
    <div class="all">

        <h1>Ctrl-H</h1>
        <form action="">
            <div>
                <label for="language">Choose target language</label>
                <select name="" id="target">
                    <option value="java">java</option>
                    <option value="cpp">cpp</option>
                </select>
            </div>
            <div>
                <label for="path">Choose file or directory path:</label>
                <input type="file" name="" id="path">
            </div>
            <div>
                <label for="">Query Language</label>
                <textarea rows="10" cols="50" placeholder="Enter Query Language." id="query"></textarea>
            </div>
            <div>
                <label for="replace">Replace Language</label>
                <textarea rows="10" cols="50" placeholder="Enter Replace Language." id="replace"></textarea>
            </div>
            <div>
                <input type="button" name="" id="run" value="RUN">
            </div>
        </form>
    </div>
</body>
<script>
    (function() {
        const vscode = acquireVsCodeApi();
        document.getElementById("run").onclick = function() {
            const targetLanguage = document.getElementById("target").value;
            // const path = document.getElementById("path").files[0];// TODO
            const queryLanguage = document.getElementById("query").value;
            const replaceLanguage = document.getElementById("replace").value;
            vscode.postMessage({
                command: "run",
                text: {
                    "targetLanguage": targetLanguage,
                    "path": "",
                    "queryLanguage": queryLanguage,
                    "replaceLanguage": replaceLanguage,
                }
            });
        }
    }());
</script>
</html>
    `;
}