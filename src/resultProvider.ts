import * as vscode from 'vscode';
import * as path from 'path';
import { ResultJSON } from './json';

export class ResultProvider implements vscode.TreeDataProvider<FileItem | ResultItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<void | FileItem | ResultItem | (FileItem | ResultItem)[]> = new vscode.EventEmitter < void | FileItem | ResultItem | (FileItem | ResultItem)[]>();
    onDidChangeTreeData: vscode.Event<void | FileItem | ResultItem | (FileItem | ResultItem)[] | null | undefined> | undefined = this._onDidChangeTreeData.event;

    refresh(): void {
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
            let fileItems: FileItem[] = [];
            for await (const file of this.resultJSON.results) {
                const uri = vscode.Uri.file(file.path);
                const document = await vscode.workspace.openTextDocument(uri);

                let fileItem = new FileItem(uri, document);

                let resultItems: ResultItem[] = [];
                for await (const res of file.result) {
                    const location = new vscode.Location(
                        uri,
                        new vscode.Range(// vscode.Position is zero-based
                            new vscode.Position(res.sr - 1, res.sc),
                            new vscode.Position(res.er, res.ec),
                        ),
                    );
                    resultItems.push(new ResultItem(
                        fileItem,
                        location,
                    ));
                };

                fileItem.results = resultItems;

                fileItems.push(fileItem);
            };
            return fileItems;
        }
        if (fathItem instanceof FileItem) {
            return fathItem.results;
        }
        return undefined;
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