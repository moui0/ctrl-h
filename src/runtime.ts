import * as fs from "fs";
import * as vscode from "vscode";
import { Query } from "./query";
import { FileItem, ResultItem, ResultProvider } from "./resultProvider";

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
            
            // parse query result into JSON
            // ! assume test.json is query result.
            const queryResult = fs.readFileSync("/home/why/ctrl-h/src/lib/test.json").toString();
            const queryResultJSON = JSON.parse(queryResult);

            // tree view
            const provider = new ResultProvider(queryResultJSON);
            
            let treeView = vscode.window.createTreeView(
                "result-view.tree",
                {
                    treeDataProvider: provider,
                    canSelectMany: false,
                },
            );
            // navigation
            treeView.onDidChangeSelection((event) => {
                navigation(event.selection[0]);
            });
        
            provider.refresh();
        
            // TODO: hightlights

        // }
        // TODO: replace
        // if (mode === items[1]) {
        // }
    }
}

function navigation(item: FileItem | ResultItem) {
    let fileItem = item instanceof ResultItem ? item.file : item;
    let location = item instanceof ResultItem ? item.localtion : item.results[0].localtion;
    vscode.commands.executeCommand(
        'vscode.open',
        fileItem.uri, {
            selection: new vscode.Selection(location.range.start, location.range.start),
        }
    );
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