import * as vscode from 'vscode';
import { showJSON } from './query';
import { getSourceCodePath, runHander } from "./runtime";
import { getWebViewContent } from './webview';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("result-view.showJSON", () => {
        showJSON();
    });
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
        panel.webview.onDidReceiveMessage(async message =>  {
            switch (message.command) {
                case "run":
                    const targetLanguage = message.text.targetLanguage;
                    const queryLanguage = message.text.queryLanguage;
                    const replaceLanguage = message.text.replaceLanguage;

                    if (queryLanguage.replace(/\s/g, "") === "") {
                        vscode.window.showErrorMessage("Query Language can not be null");
                        return;
                    }
                    
                    const path = await getSourceCodePath(targetLanguage);
                    if (!path) {return;}

                    try {
                        await runHander(
                            targetLanguage,
                            path,
                            queryLanguage,
                            replaceLanguage,
                        );
                        panel.dispose();
                    } catch (error: any) {
                        vscode.window.showErrorMessage(error.toString());
                    }
                    
                    break;
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
