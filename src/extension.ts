import * as vscode from 'vscode';
import { MovieStatsProvider } from './movieStatsProvider';

/**
 * Extension activation
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Movie Stats extension is now active!');

  // Register the webview provider
  const provider = new MovieStatsProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(MovieStatsProvider.viewType, provider)
  );

  // Register refresh command
  context.subscriptions.push(
    vscode.commands.registerCommand('movieStats.refresh', () => {
      provider.refresh();
      vscode.window.showInformationMessage('Refreshing movie stats...');
    })
  );

  // Register show command (for command palette)
  context.subscriptions.push(
    vscode.commands.registerCommand('movieStats.show', () => {
      vscode.commands.executeCommand('movieStatsView.focus');
    })
  );
}

/**
 * Extension deactivation
 */
export function deactivate() {}
