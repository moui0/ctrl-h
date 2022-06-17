import * as fs from "fs";
import * as vscode from "vscode";
import { Query } from "./query";
import { Replace } from "./replace";
import { FileItem, ResultItem, ResultProvider } from "./resultProvider";

var treeView: vscode.TreeView<FileItem | ResultItem>;
var provider: ResultProvider;

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
    try {
        await query.execQuery();
    } catch (error) {
        throw error;
    }
    
    // parse query result into JSON
    const queryResult = fs.readFileSync(__dirname + "/../src/lib/out/res.json").toString();
    const queryResultJSON = JSON.parse(queryResult);

    // tree view
    provider = new ResultProvider(queryResultJSON);
    provider.refresh();
    
    treeView = vscode.window.createTreeView(
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

    const replace = new Replace(replaceLanguage, queryResultJSON);
    try {
        replace.execReplace();
    } catch (error) {
        throw error;
    }
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

export async function getSourceCodePath(targetLanguage: string) {
    const label = targetLanguage === "java" ? "Java" : "Cpp";
    const ext = targetLanguage === "java" ? ["java"] : ["c", "cpp"];
    
    const path = await vscode.window.showOpenDialog(
        {
            canSelectFiles: true,
            canSelectFolders: true,
            canSelectMany: false,
            filters: {
                label: ext
            },
            title: "Enter the path to search or replace.",
        }
    );
    if (path) {
        return path[0].path;
    }
}