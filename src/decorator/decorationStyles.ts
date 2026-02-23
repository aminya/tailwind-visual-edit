import * as vscode from 'vscode';
import { TailwindCategory, CATEGORY_COLOR_MAP } from '../types/categories';

export function createDecorationTypes(): Map<TailwindCategory, vscode.TextEditorDecorationType> {
  const map = new Map<TailwindCategory, vscode.TextEditorDecorationType>();

  for (const category of Object.values(TailwindCategory)) {
    if (category === TailwindCategory.Unknown) { continue; }

    const colors = CATEGORY_COLOR_MAP[category];
    const decorationType = vscode.window.createTextEditorDecorationType({
      light: {
        color: colors.light.color,
      },
      dark: {
        color: colors.dark.color,
      },
    });

    map.set(category, decorationType);
  }

  return map;
}
