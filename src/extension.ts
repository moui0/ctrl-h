import * as vscode from 'vscode';
import { runHander } from "./input";
import { ResultProvider } from './resultProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("ctrl-h-run", runHander);


    // const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
    //     ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
    // const resultProvider = new ResultProvider(rootPath);
    // vscode.commands.registerCommand("result-view.main", () => {
        
    // });
    // vscode.window.registerTreeDataProvider('result-view.main', resultProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {}
