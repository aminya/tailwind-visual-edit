import { WebToExtMessage } from '../types/messages';
import { SyncEngine } from '../sync/syncEngine';

/**
 * Handles messages received from the webview panel.
 */
export function handleWebviewMessage(message: WebToExtMessage, syncEngine: SyncEngine): void {
  switch (message.type) {
    case 'updateClass':
      syncEngine.applyClassUpdate(message.payload);
      break;

    case 'ready':
      // Webview is ready, send current state
      const state = syncEngine.getCurrentState();
      // State will be sent via the normal callback mechanism
      break;
  }
}
