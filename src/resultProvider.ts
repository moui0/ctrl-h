import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Query } from './query';

export class ResultProvider implements vscode.TreeDataProvider<FileItem | ResultItem> {
    fileItems: FileItem[] = [];
    rootLength;
    // queryHandler: Query = new Query();

    constructor(private workspaceRoot: string | undefined) {
        this.rootLength = workspaceRoot ? workspaceRoot.length : 0;
    }
    
    getTreeItem(element: FileItem | ResultItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: FileItem | ResultItem) {
        if (!element) {
            if (this.workspaceRoot) {
                this.walk(this.workspaceRoot);
            }
            return this.fileItems;
        }
        if (element instanceof FileItem) {
            // TODO: search in file
            // let queryResult = new Query().execQuery(element.directory + "/" + element.filename, "'if(){}'");
            // console.log(queryResult);
            
            // const result = [];
            // result.push(new ResultItem(
                // queryResult
            // ));
            // return result;
        }
        return undefined;
    }

    public walk(directory: string) {
        const files = fs.readdirSync(directory);
        for (let filename of files) {
            const filepath = path.join(directory, filename);
            if (fs.statSync(filepath).isDirectory()) {
                this.walk(filepath);
            } else if (path.extname(filename) === '.java') {
                this.fileItems.push(new FileItem(
                    filename,
                    directory,
                    // directory.substring(this.rootLength + 1),
                ));
            }
        }
    }
}

class FileItem extends vscode.TreeItem {
    constructor(
        public filename: string,
        public directory: string,
        public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed,
    ) {
        super(filename, collapsibleState);
        this.description = directory;
    }
}

class ResultItem extends vscode.TreeItem {
    constructor(
        public label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
    ) {
        super(label, collapsibleState);
    }
}