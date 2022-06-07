"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const references = require("./references");
const tree_1 = require("./tree");
function activate(context) {
    const tree = new tree_1.SymbolsTree();
    references.register(tree, context);
    function setInput(input) {
        tree.setInput(input);
    }
    return { setInput };
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map