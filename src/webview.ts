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
            background-color: white;
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
        input:hover {
            border-color: #0e639c;
        }
        #run {
            background-color: #0e639c;
            color: white;
            width: 100px;
            height: 40px;
            border: #0e639c solid;
            border-radius: 5px;
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
                <label for="path">Choose file or directory path:</label>
                <input type="file" name="" id="path">
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
            const targetLanguage = document.getElementById("target").value;
            // const path = document.getElementById("path").files[0];// TODO
            const queryLanguage = document.getElementById("query").value;
            const replaceLanguage = document.getElementById("replace").value;
            vscode.postMessage({
                command: "run",
                text: {
                    "targetLanguage": targetLanguage,
                    "path": "",
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