import { PanelState } from './panelState';

// Extension -> Webview
export type ExtToWebMessage =
  | { type: 'updateState'; payload: PanelState }
  | { type: 'noElementSelected' };

// Webview -> Extension
export type WebToExtMessage =
  | { type: 'updateClass'; payload: ClassUpdatePayload }
  | { type: 'ready' };

export interface ClassUpdatePayload {
  category: string;
  property: string;
  action: 'add' | 'remove' | 'replace';
  oldClass?: string;
  newClass?: string;
}
