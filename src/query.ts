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
        const childProcess = require('child_process');
        const jarPath = path.normalize(__dirname + "/../src/lib/ctrl-h.jar");
        const cmd = "java -jar " + jarPath
            + " -f " + this.filePath
            + " -s "
            + " -l " + this.queryLanguage
            ;
        const result = childProcess.execSync(cmd);
        return String.fromCharCode.apply(null, result);
        // return this.parse(String.fromCharCode.apply(null, result));
    }
}
