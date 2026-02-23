import * as vscode from 'vscode';
import { TailwindCategory, CATEGORY_LABELS } from '../types/categories';
import { extractClassOccurrences } from '../parser/classExtractor';
import { categorizeClass } from '../parser/classCategorizer';
import { createDecorationTypes } from './decorationStyles';

const SUPPORTED_LANGUAGES = [
  'typescriptreact', 'javascriptreact', 'html', 'vue', 'svelte', 'astro', 'php',
];

export class DecoratorManager {
  private decorationTypes: Map<TailwindCategory, vscode.TextEditorDecorationType>;
  private updateTimeout: ReturnType<typeof setTimeout> | undefined;
  private enabled = true;

  constructor() {
    this.decorationTypes = createDecorationTypes();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      // Clear all decorations
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        for (const decorationType of this.decorationTypes.values()) {
          editor.setDecorations(decorationType, []);
        }
      }
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  updateDecorations(editor: vscode.TextEditor): void {
    if (!this.enabled) { return; }
    if (!SUPPORTED_LANGUAGES.includes(editor.document.languageId)) { return; }

    const occurrences = extractClassOccurrences(editor.document);

    // Group ranges by category
    const rangesByCategory = new Map<TailwindCategory, vscode.DecorationOptions[]>();
    for (const category of Object.values(TailwindCategory)) {
      rangesByCategory.set(category, []);
    }

    for (const occ of occurrences) {
      const category = categorizeClass(occ.className);
      if (category === TailwindCategory.Unknown) { continue; }

      const label = CATEGORY_LABELS[category];
      rangesByCategory.get(category)!.push({
        range: occ.range,
        hoverMessage: new vscode.MarkdownString(
          `**${label}** \u2014 \`${occ.className}\``
        ),
      });
    }

    // Apply each category's decoration type
    for (const [category, decorationType] of this.decorationTypes) {
      const ranges = rangesByCategory.get(category) || [];
      editor.setDecorations(decorationType, ranges);
    }
  }

  triggerUpdateDecorations(editor: vscode.TextEditor): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = setTimeout(() => {
      this.updateDecorations(editor);
    }, 300);
  }

  dispose(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    for (const decorationType of this.decorationTypes.values()) {
      decorationType.dispose();
    }
  }
}
