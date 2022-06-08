import * as vscode from 'vscode';
import { runHander } from "./runtime";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("ctrl-h-run", runHander);
}

// this method is called when your extension is deactivated
export function deactivate() { }
