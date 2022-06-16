import * as fs from "fs";
import * as vscode from "vscode";
import { Query } from "./query";
import { Replace } from "./replace";
import { FileItem, ResultItem, ResultProvider } from "./resultProvider";

const normal = vscode.window.createTextEditorDecorationType(
    {
        backgroundColor: new vscode.ThemeColor('editor.background'),
    },
);
const highlight = vscode.window.createTextEditorDecorationType(
    {
        backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
    },
);
const selection = vscode.window.createTextEditorDecorationType(
    {
        backgroundColor: new vscode.ThemeColor('editor.findMatchBackground'),
    },
);


export async function runHander(targetLanguage: string, sourceCodePath: string, queryLanguage: string, replaceLanguage: string) {
    const query = new Query(targetLanguage, sourceCodePath, queryLanguage);
    const res = query.execQuery();
    // TODO: jar包运行时异常处理
    console.log(res);
    
    // parse query result into JSON
    const queryResult = fs.readFileSync(__dirname + "/../src/lib/out/res.json").toString();
    const queryResultJSON = JSON.parse(queryResult);

    // tree view
    const provider = new ResultProvider(queryResultJSON);
    provider.refresh();
    
    let treeView = vscode.window.createTreeView(
        "result-view.tree",
        {
            treeDataProvider: provider,
            canSelectMany: false,
        },
    );
    treeView.onDidChangeSelection((event) => {
        // navigation
        navigation(event.selection[0]);
        // highlights
        highlights(event.selection[0], provider);
    });

    // TODO: replace
    const replace = new Replace(replaceLanguage, queryResultJSON);
    replace.execReplace();

}

function highlights(item: FileItem | ResultItem, provider: ResultProvider) {
    let currentRange = item instanceof ResultItem ? item.localtion : item.results[0].localtion;
    const uri = item instanceof ResultItem ? item.file.uri : item.uri;
    const ranges = provider.getEditorHighlightRanges(uri);

    let editor = vscode.window.activeTextEditor;
    if (editor && ranges) {
        editor.setDecorations(normal, ranges);
        editor.setDecorations(highlight, ranges);
        editor.setDecorations(normal, [currentRange]);
        editor.setDecorations(selection, [currentRange]);
    }
}

function navigation(item: FileItem | ResultItem) {
    let fileItem = item instanceof ResultItem ? item.file : item;
    let location = item instanceof ResultItem ? item.localtion : item.results[0].localtion;
    vscode.commands.executeCommand(
        'vscode.open',
        fileItem.uri,
        {
            selection: new vscode.Selection(location.range.start, location.range.end),
        }
    );
}

export async function getSourceCodePath() {
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
            defaultUri: vscode.Uri.file("/home/why/Java/test.java"),
        }
    );
    if (path) {
        return path[0].path;
    }
}