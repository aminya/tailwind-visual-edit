import * as vscode from 'vscode';
import { DecoratorManager } from './decorator/decoratorManager';
import { PanelProvider } from './panel/PanelProvider';
import { SyncEngine } from './sync/syncEngine';

export function activate(context: vscode.ExtensionContext) {
  const syncEngine = new SyncEngine();
  const decoratorManager = new DecoratorManager();
  const panelProvider = new PanelProvider(context.extensionUri, syncEngine);

  // Register the sidebar webview view
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      PanelProvider.viewType,
      panelProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  // Toggle highlighting command
  context.subscriptions.push(
    vscode.commands.registerCommand('tailwindVisualEdit.toggleHighlighting', () => {
      const newState = !decoratorManager.isEnabled();
      decoratorManager.setEnabled(newState);
      if (newState && vscode.window.activeTextEditor) {
        decoratorManager.updateDecorations(vscode.window.activeTextEditor);
      }
      vscode.window.showInformationMessage(
        `Tailwind class highlighting ${newState ? 'enabled' : 'disabled'}`
      );
    })
  );

  // Decorate on active editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        decoratorManager.updateDecorations(editor);
      }
    })
  );

  // Decorate on document change (debounced)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      const editor = vscode.window.activeTextEditor;
      if (editor && event.document === editor.document) {
        decoratorManager.triggerUpdateDecorations(editor);
      }
    })
  );

  // Track cursor for panel sync
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(event => {
      syncEngine.onCursorMove(event.textEditor, event.selections[0]);
    })
  );

  // Read configuration
  const config = vscode.workspace.getConfiguration('tailwindVisualEdit');
  const highlightingEnabled = config.get<boolean>('enableHighlighting', true);
  decoratorManager.setEnabled(highlightingEnabled);

  // Initial decoration for the active editor
  if (vscode.window.activeTextEditor) {
    decoratorManager.updateDecorations(vscode.window.activeTextEditor);
  }
}

export function deactivate() {}
