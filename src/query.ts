import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";

var jarPath = path.normalize(__dirname + "/../src/lib/ctrl-h.jar");
var jsonPath = path.normalize(__dirname + "/../src/lib/out/res.json");

export class Query {
    private queryLanguage: string = "''";
    
    constructor(
        public targetLanguage: string,
        public filePath: string,
        queryLanguage: string,
    ) {
        this.queryLanguage = "'" + queryLanguage + "'";
    }
    public execQuery() {
        const childProcess = require('child_process');
        childProcess.execSync("cd " + __dirname + "/../src/lib/");
        const cmd = "java -jar " + jarPath
            + " -p " + this.filePath
            + " -t " + this.queryLanguage
            + " -d " + jsonPath
            + " -l " + this.targetLanguage
            ;
        const result = childProcess.execSync(cmd);
        console.log("[exec jar]: [\n" + result + "\n]");
        
        return String.fromCharCode.apply(null, result);
    }
}

export function showJSON() {
    vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.file(jsonPath),
    );
}
