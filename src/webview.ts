export function getWebViewContent() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ctrl-H</title>
    <style>
        body {
            background-color: var(--vscode-editor-background);
            font-family: var(--vscode-editor-font-family);
            color: var(--vscode-editor-foreground);
        }
        .all {
            width: 500px;
            margin: 20px auto;
        }
        label {
            display: block;
            margin-bottom: 10px;
        }
        div {
            margin-top: 20px;
        }

        input, textarea {
            background-color: var(--vscode-input-background);
            border: var(--vscode-input-border);
            color: var(--vscode-input-foreground);
            font-family: var(--vscode-editor-font-family);
        }
        #target {
            font-family: var(--vscode-editor-font-family);
            background-color: var(--vscode-dropdown-background);
            border: var(--vscode-dropdown-border);
            color: var(--vscode-dropdown-foreground);
        }
        #run {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            width: 100px;
            height: 40px;
            border: var(--vscode-button-border);
            border-radius: 5px;
        }
        #run:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

    </style>
</head>

<body>
    <div class="all">

        <h1>Ctrl-H</h1>
        <form action="">
            <div>
                <label for="language">Choose target language</label>
                <select name="" id="target">
                    <option value="java">java</option>
                    <option value="cpp">cpp</option>
                </select>
            </div>
            <div>
                <label for="">Query Language</label>
                <textarea rows="10" cols="50" placeholder="Enter Query Language." id="query"></textarea>
            </div>
            <div>
                <label for="replace">Replace Language</label>
                <textarea rows="10" cols="50" placeholder="Enter Replace Language." id="replace"></textarea>
            </div>
            <div>
                <input type="button" name="" id="run" value="RUN">
            </div>
        </form>
    </div>
</body>
<script>
    (function() {
        const vscode = acquireVsCodeApi();
        document.getElementById("run").onclick = function() {
            let targetLanguage = document.getElementById("target").value;
            let queryLanguage = document.getElementById("query").value;
            let replaceLanguage = document.getElementById("replace").value;

            vscode.postMessage({
                command: "run",
                text: {
                    "targetLanguage": targetLanguage,
                    "queryLanguage": queryLanguage,
                    "replaceLanguage": replaceLanguage,
                }
            });
        }
    }());
</script>
</html>
    `;
}