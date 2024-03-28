import vscode from "vscode";

export function initializeCommands(context: vscode.ExtensionContext){
  context.subscriptions.push(
		vscode.commands.registerCommand('sample.commandOnMember', (member: MemberItem) => vscode.window.showInformationMessage(vscode.l10n.t('Hello')))
	);
}