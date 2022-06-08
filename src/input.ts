import * as fs from "fs";
import * as vscode from "vscode";
import { Query } from "./query";
import { ResultProvider } from "./resultProvider";

export async function runHander() {
    const items = ["Search", "Replace"];
    const mode = await getMode(items);
    // const sourceCodePath = await getSourceCodePath();
    // const queryLanguagePath = await getQueryLanguagePath();
    if (mode) {
        // TODO: search
        // if (mode === items[0] && sourceCodePath && queryLanguagePath) {
            // ! Temporary annotation
            // const query = new Query(sourceCodePath, queryLanguagePath);
            // const res = query.execQuery();
            // console.log(res);
            
            // TODO: parse query result into JSON
            // ! assume test.json is query result.
            const queryResult = fs.readFileSync("/home/why/ctrl-h/src/lib/test.json").toString();
            const queryResultJSON = JSON.parse(queryResult);

            // TODO: show view-tree
            const provider = new ResultProvider(queryResultJSON);
            vscode.window.registerTreeDataProvider("result-view.tree", provider);
            provider.refresh();


            // TODO: hightlights

            // TODO: navigation
            
        // }
        // TODO: replace
        // if (mode === items[1]) {
        // }
    }
}

async function getMode(items: string[]) {
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
            // ! default url
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
            // ! default url
            defaultUri: vscode.Uri.file("/home/why/Java/test.query"),
        }
    );
    if (path) {
        return path[0].path;
    }
}