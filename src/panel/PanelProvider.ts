import * as vscode from 'vscode';
import { SyncEngine } from '../sync/syncEngine';
import { handleWebviewMessage } from './panelMessageHandler';
import { PanelState } from '../types/panelState';
import { WebToExtMessage } from '../types/messages';

export class PanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'tailwindVisualEdit.panel';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _syncEngine: SyncEngine
  ) {
    this._syncEngine.onStateChange((state) => {
      if (state) {
        this.sendStateToWebview(state);
      } else {
        this.sendNoSelection();
      }
    });
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((message: WebToExtMessage) => {
      handleWebviewMessage(message, this._syncEngine);
    });
  }

  public refresh(): void {
    if (this._view) {
      const state = this._syncEngine.getCurrentState();
      if (state) {
        this.sendStateToWebview(state);
      } else {
        this.sendNoSelection();
      }
    }
  }

  private sendStateToWebview(state: PanelState): void {
    this._view?.webview.postMessage({ type: 'updateState', payload: state });
  }

  private sendNoSelection(): void {
    this._view?.webview.postMessage({ type: 'noElementSelected' });
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'panel.css')
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'panel.js')
    );
    const spacingSectionUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'sections', 'spacingSection.js')
    );
    const typographySectionUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'sections', 'typographySection.js')
    );
    const colorSectionUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'sections', 'colorSection.js')
    );
    const effectsSectionUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'webview', 'sections', 'effectsSection.js')
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="${styleUri}" rel="stylesheet">
  <title>Tailwind Visual Edit</title>
</head>
<body>
  <div id="panel-root">
    <div id="no-selection" class="placeholder">
      <div class="placeholder-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
          <path d="M24 18C21.8 18 20 19.8 20 22C20 24.2 21.8 26 24 26C26.2 26 28 24.2 28 22C28 19.8 26.2 18 24 18Z" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/>
        </svg>
      </div>
      <p class="placeholder-title">Tailwind Visual Edit</p>
      <p>Place your cursor inside a JSX/HTML element to edit its Tailwind classes visually.</p>
    </div>
    <div id="editor-sections" style="display:none;">
      <div id="element-info" class="element-header"></div>
      <div id="classes-preview" class="classes-preview"></div>
      <div id="section-spacing"></div>
      <div id="section-typography"></div>
      <div id="section-color"></div>
      <div id="section-effects"></div>
    </div>
  </div>
  <script nonce="${nonce}" src="${spacingSectionUri}"></script>
  <script nonce="${nonce}" src="${typographySectionUri}"></script>
  <script nonce="${nonce}" src="${colorSectionUri}"></script>
  <script nonce="${nonce}" src="${effectsSectionUri}"></script>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
