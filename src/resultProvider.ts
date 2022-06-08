import * as vscode from 'vscode';
import * as path from 'path';
import { ResultJSON } from './json';

export class ResultProvider implements vscode.TreeDataProvider<FileItem | ResultItem> {
    private path2idx = new Map<string, number>();
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
            this.resultJSON.results.forEach((element, idx, _arr) => {
                this.path2idx.set(element.path, idx);
                fileItems.push(new FileItem(
                    element.path,
                ));
            });
            return fileItems;
        }
        if (fathItem instanceof FileItem) {
            let resultItems: ResultItem[] = [];
            let idx = this.path2idx.get(fathItem.filepath);
            if (idx !== undefined) {
                for await (const element of this.resultJSON.results[idx].result) {
                    const location = new vscode.Location(
                        vscode.Uri.file(fathItem.filepath),
                        new vscode.Range(// vscode.Position is zero-based
                            new vscode.Position(element.sr - 1, element.sc),
                            new vscode.Position(element.er, element.ec),
                        )
                    );
                    const doc = await vscode.workspace.openTextDocument(location.uri);
                    const label = doc.getText(location.range);
                    resultItems.push(new ResultItem(
                        label,
                    ));
                }
            }
            return resultItems;
        }
        return undefined;
    }
}

class FileItem extends vscode.TreeItem {
    constructor(
        public filepath: string,
        public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed,
    ) {
        super(vscode.Uri.file(filepath), collapsibleState);
        this.description = path.dirname(filepath);
        this.iconPath = vscode.ThemeIcon.File;
    }
}

class ResultItem extends vscode.TreeItem {
    constructor(
        label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
    ) {
        super(
            {
                label,
                highlights: [[0, label.length]],
            }, 
            collapsibleState,
        );
    }
}