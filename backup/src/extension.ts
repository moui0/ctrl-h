import * as vscode from 'vscode';
import * as references from './references';
import { SymbolTree, SymbolTreeInput } from './references-view';
import { SymbolsTree } from './tree';

export function activate(context: vscode.ExtensionContext): SymbolTree {
	const tree = new SymbolsTree();

	references.register(tree, context);

	function setInput(input: SymbolTreeInput<unknown>) {
		tree.setInput(input);
	}

	return { setInput };
}
