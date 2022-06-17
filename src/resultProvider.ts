import * as vscode from 'vscode';
import * as path from 'path';
import { ResultJSON } from './json';

export class ResultProvider implements vscode.TreeDataProvider<FileItem | ResultItem> {
    private _fileItems: FileItem[] = [];
    private _onDidChangeTreeData: vscode.EventEmitter<void | FileItem | ResultItem | (FileItem | ResultItem)[]> = new vscode.EventEmitter < void | FileItem | ResultItem | (FileItem | ResultItem)[]>();
    onDidChangeTreeData: vscode.Event<void | FileItem | ResultItem | (FileItem | ResultItem)[] | null | undefined> | undefined = this._onDidChangeTreeData.event;

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    constructor(
        private resultJSON: ResultJSON,
    ) {
    }

    getTreeItem(element: FileItem | ResultItem): vscode.TreeItem {
        return element;
    }

    async getChildren(fathItem?: FileItem | ResultItem) {
        if (!fathItem) {// root
            this._fileItems = [];
            for await (const file of this.resultJSON.results) {
                const uri = vscode.Uri.file(file.path);
                const document = await vscode.workspace.openTextDocument(uri);

                let fileItem = new FileItem(uri, document);

                let resultItems: ResultItem[] = [];
                for await (const res of file.path_res[0].label_res) {
                    const position = res.position;
                    const location = new vscode.Location(
                        uri,
                        new vscode.Range(// vscode.Position is zero-based, some adjustment is needed.
                            new vscode.Position(position.sr - 1, position.sc),
                            new vscode.Position(position.er - 1, position.ec + 1),
                        ),
                    );
                    resultItems.push(new ResultItem(
                        fileItem,
                        location,
                    ));
                };

                fileItem.results = resultItems;

                this._fileItems.push(fileItem);
            };
            return this._fileItems;
        }
        if (fathItem instanceof FileItem) {
            return fathItem.results;
        }
        return undefined;
    }

    public getEditorHighlightRanges(uri: vscode.Uri): vscode.Range[] | undefined {
        const file = this._fileItems.find(file => file.uri.toString() === uri.toString());
        return file?.results.map(res => res.localtion.range);
    }
}

export class FileItem extends vscode.TreeItem {
    public results: ResultItem[] = [];
    constructor(
        public uri: vscode.Uri,
        public document: vscode.TextDocument,
        public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed,
    ) {
        super(uri, collapsibleState);
        this.description = path.dirname(uri.path);
        this.iconPath = vscode.ThemeIcon.File;
    }
}

export class ResultItem extends vscode.TreeItem {
    constructor(
        public file: FileItem,
        public localtion: vscode.Location,
        public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
    ) {
        super(
            file.document.getText(localtion.range),
            collapsibleState,
        );
    }
}