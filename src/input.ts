import * as vscode from "vscode";
import { Query } from "./query";

export async function runHander() {
    const mode = await getMode();
    const sourceCodePath = await getSourceCodePath();
    const queryLanguagePath = await getQueryLanguagePath();
    if (mode) {
        if (sourceCodePath && queryLanguagePath) {
            const query = new Query(sourceCodePath, queryLanguagePath);
            const res = query.execQuery();
            vscode.window.showInformationMessage(`${res}`);
        }
    }
}

async function getMode() {
    const items = ["Search", "Replace"];
    const mode = await vscode.window.showQuickPick(
        items,
        {
            placeHolder: "Choose Search or Replace.",
        },
    );
    return mode;
}

async function getSourceCodePath() {
    const path = await vscode.window.showOpenDialog(
        {
            canSelectFiles: true,
            canSelectFolders: true,
            canSelectMany: false,
            filters: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "Java": ["java"]
            },
            title: "Enter the path to search or replace.",
            defaultUri: vscode.Uri.file("/home/why/Java/src/org/antlr/v4/runtime/Lexer.java"),
        }
    );
    if (path) {
        return path[0].path;
    }
}

async function getQueryLanguagePath() {
    const path = await vscode.window.showOpenDialog(
        {
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "Query": ["query"]
            },
            title: "Enter the path of query language file.",
            defaultUri: vscode.Uri.file("/home/why/Java/test.query"),
        }
    );
    if (path) {
        return path[0].path;
    }
}