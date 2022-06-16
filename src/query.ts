import * as fs from "fs";
import * as path from "path";

export class Query {
    private queryLanguage: string = "''";
    
    constructor(
        public targetLanguage: string,
        public filePath: string,
        queryLanguage: string,
    ) {
        this.queryLanguage = "'" + queryLanguage + "'";
    }
    public execQuery(): string {
        const childProcess = require('child_process');
        const jarPath = path.normalize(__dirname + "/../src/lib/ctrl-h.jar");
        const jsonPath = path.normalize(__dirname + "/../src/lib/out/res.json");
        childProcess.execSync("cd " + __dirname + "/../src/lib/");
        const cmd = "java -jar " + jarPath
            + " -p " + this.filePath
            + " -t " + this.queryLanguage
            + " -d " + jsonPath
            + " -l " + this.targetLanguage
            ;
        const result = childProcess.execSync(cmd);
        return String.fromCharCode.apply(null, result);
    }
}
