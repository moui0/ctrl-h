import * as fs from "fs";
import * as path from "path";

export class Query {
    private filePath: string;
    private queryLanguage: string = "''";
    
    constructor(
        filePath: string,
        queryLanguagePath: string,
    ) {
        this.filePath = filePath;
        this.queryLanguage = "'" + fs.readFileSync(queryLanguagePath, {encoding: "utf-8"}) + "'";
    }
    public execQuery(): string {
        // TODO: replace ctrl-h.jar
        const childProcess = require('child_process');
        const jarPath = path.normalize(__dirname + "/../src/lib/ctrl-h.jar");
        const jsonPath = path.normalize(__dirname + "/../src/lib/out/res.json");
        childProcess.execSync("cd " + __dirname + "/../src/lib/");
        const cmd = "java -jar " + jarPath
            + " -p " + this.filePath
            + " -t " + this.queryLanguage
            + " -d " + jsonPath
            ;
        const result = childProcess.execSync(cmd);
        return String.fromCharCode.apply(null, result);
    }
}
