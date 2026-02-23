import * as vscode from 'vscode';
import { PanelState } from '../types/panelState';
import { ClassUpdatePayload } from '../types/messages';
import { findClassAttributeAtCursor, ClassAttributeAtCursor } from '../parser/classExtractor';
import { buildPanelState } from '../panel/panelStateBuilder';
import { writeClassChange, expandShorthand } from './classWriter';

type StateChangeCallback = (state: PanelState | null) => void;

export class SyncEngine {
  private _currentState: PanelState | null = null;
  private _currentAttribute: ClassAttributeAtCursor | null = null;
  private _callbacks: StateChangeCallback[] = [];
  private _isWriting = false;

  onStateChange(callback: StateChangeCallback): void {
    this._callbacks.push(callback);
  }

  getCurrentState(): PanelState | null {
    return this._currentState;
  }

  private notify(state: PanelState | null): void {
    for (const cb of this._callbacks) {
      cb(state);
    }
  }

  /**
   * Called when the cursor moves. Re-reads the element at cursor
   * and emits new state to the panel.
   */
  onCursorMove(editor: vscode.TextEditor, selection: vscode.Selection): void {
    if (this._isWriting) { return; }

    const result = findClassAttributeAtCursor(editor.document, selection.active);
    if (!result) {
      this._currentState = null;
      this._currentAttribute = null;
      this.notify(null);
      return;
    }

    this._currentAttribute = result;
    this._currentState = buildPanelState(result.classes, result.tagName);
    this.notify(this._currentState);
  }

  /**
   * Called when the webview panel sends a class update.
   * Writes the change to the active editor document.
   */
  async applyClassUpdate(payload: ClassUpdatePayload): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !this._currentAttribute) { return; }

    this._isWriting = true;
    try {
      let actualPayload = payload;

      // Handle shorthand expansion if needed
      if (payload.action === 'replace' && payload.newClass) {
        const expansion = expandShorthand(
          this._currentAttribute.classes,
          payload.property,
          payload.newClass.split('-').pop() || ''
        );

        if (expansion) {
          // Remove the shorthand and add expanded classes
          let classes = this._currentAttribute.classes.filter(c => c !== expansion.oldClass);
          // Also remove any existing directional classes that would conflict
          const expandedPrefixes = expansion.newClasses.map(c => c.split('-')[0]);
          classes = classes.filter(c => {
            const prefix = c.split('-')[0];
            return !expandedPrefixes.includes(prefix);
          });
          classes.push(...expansion.newClasses);

          const newValue = classes.join(' ');
          await editor.edit(editBuilder => {
            editBuilder.replace(this._currentAttribute!.range, newValue);
          });

          this.refreshAfterWrite(editor);
          return;
        }
      }

      // Standard class update
      await writeClassChange(
        editor,
        this._currentAttribute.range,
        this._currentAttribute.classes,
        actualPayload
      );

      this.refreshAfterWrite(editor);
    } finally {
      this._isWriting = false;
    }
  }

  private refreshAfterWrite(editor: vscode.TextEditor): void {
    // Re-read the attribute at current cursor to get updated state
    const result = findClassAttributeAtCursor(editor.document, editor.selection.active);
    if (result) {
      this._currentAttribute = result;
      this._currentState = buildPanelState(result.classes, result.tagName);
      this.notify(this._currentState);
    }
  }
}
