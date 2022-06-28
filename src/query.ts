import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
import { performance } from "perf_hooks";

export var jarPath = path.normalize(__dirname + "/../lib/ctrl-h.jar");
export var jsonPath = path.normalize(__dirname + "/../lib/out/res.json");

export class Query {
    private queryLanguage: string = '""';

    constructor(
        public targetLanguage: string,
        public filePath: string,
        queryLanguage: string,
    ) {
        this.queryLanguage = '"' + queryLanguage + '"';
        if (process.platform === "win32") {
            this.queryLanguage = this.queryLanguage.replace(/\n/g, "");
        }
    }
    public async execQuery() {
        const util = require("util");
        const exec = util.promisify(require("child_process").exec);
        let cmd = "java -jar " + jarPath
            + " -p " + this.filePath
            + " -t " + this.queryLanguage
            + " -d " + jsonPath
            + " -l " + this.targetLanguage
            ;
        if (process.platform === "win32") {
            cmd = "cmd /c " + cmd;
        }
        // vscode.window.showErrorMessage(cmd);
        const start = performance.now();
        const { stdout, stderr } = await exec(cmd);
        const end = performance.now();
        vscode.window.showInformationMessage("The program execution time: " + (end - start) + "ms.");
        
        if (stderr === "No matching results.\n") {
            throw new Error(stderr);
        } else if (stderr !== "") {
            throw new Error("Query Language or Source Code syntax error: " + stderr);
            
        }
    }
}

export function showJSON() {
    vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.file(jsonPath),
    );
}
