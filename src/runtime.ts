import * as fs from "fs";
import * as vscode from "vscode";
import { Query } from "./query";
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
    // TODO: search
    const query = new Query(sourceCodePath, queryLanguage);
    const res = query.execQuery();
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
