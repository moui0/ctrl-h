"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorHighlights = void 0;
const vscode = require("vscode");
class EditorHighlights {
    constructor(_view, _delegate) {
        this._view = _view;
        this._delegate = _delegate;
        this._decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
            overviewRulerLane: vscode.OverviewRulerLane.Center,
            overviewRulerColor: new vscode.ThemeColor('editor.findMatchHighlightBackground'),
        });
        this.disposables = [];
        this._ignore = new Set();
        this.disposables.push(vscode.workspace.onDidChangeTextDocument(e => this._ignore.add(e.document.uri.toString())), vscode.window.onDidChangeActiveTextEditor(() => _view.visible && this.update()), _view.onDidChangeVisibility(e => e.visible ? this._show() : this._hide()), _view.onDidChangeSelection(() => _view.visible && this.update()));
        this._show();
    }
    dispose() {
        vscode.Disposable.from(...this.disposables).dispose();
        for (const editor of vscode.window.visibleTextEditors) {
            editor.setDecorations(this._decorationType, []);
        }
    }
    _show() {
        const { activeTextEditor: editor } = vscode.window;
        if (!editor || !editor.viewColumn) {
            return;
        }
        if (this._ignore.has(editor.document.uri.toString())) {
            return;
        }
        const [anchor] = this._view.selection;
        if (!anchor) {
            return;
        }
        const ranges = this._delegate.getEditorHighlights(anchor, editor.document.uri);
        if (ranges) {
            editor.setDecorations(this._decorationType, ranges);
        }
    }
    _hide() {
        for (const editor of vscode.window.visibleTextEditors) {
            editor.setDecorations(this._decorationType, []);
        }
    }
    update() {
        this._hide();
        this._show();
    }
}
exports.EditorHighlights = EditorHighlights;
//# sourceMappingURL=highlights.js.map