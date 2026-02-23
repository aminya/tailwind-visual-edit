import * as vscode from 'vscode';
import { ClassUpdatePayload } from '../types/messages';

/**
 * Writes class changes to the document.
 * Handles add, remove, and replace operations on className values.
 */
export async function writeClassChange(
  editor: vscode.TextEditor,
  attributeRange: vscode.Range,
  currentClasses: string[],
  payload: ClassUpdatePayload
): Promise<boolean> {
  const { action, oldClass, newClass } = payload;

  let updatedClasses: string[];

  switch (action) {
    case 'replace':
      if (oldClass && newClass) {
        updatedClasses = currentClasses.map(c => c === oldClass ? newClass : c);
      } else {
        return false;
      }
      break;

    case 'add':
      if (newClass) {
        updatedClasses = [...currentClasses, newClass];
      } else {
        return false;
      }
      break;

    case 'remove':
      if (oldClass) {
        updatedClasses = currentClasses.filter(c => c !== oldClass);
      } else {
        return false;
      }
      break;

    default:
      return false;
  }

  const newValue = updatedClasses.join(' ');

  return editor.edit(editBuilder => {
    editBuilder.replace(attributeRange, newValue);
  });
}

/**
 * Handles shorthand expansion when modifying a single direction.
 * E.g., changing paddingTop on "p-4" should expand to "pt-6 pr-4 pb-4 pl-4".
 */
export function expandShorthand(
  currentClasses: string[],
  property: string,
  newValue: string
): { oldClass: string; newClasses: string[] } | null {
  const SHORTHAND_MAP: Record<string, { shorthand: RegExp; prefix: string; expand: Record<string, string> }> = {
    paddingTop:    { shorthand: /^p-(.+)$/, prefix: 'pt', expand: { pt: 'pt', pr: 'pr', pb: 'pb', pl: 'pl' } },
    paddingRight:  { shorthand: /^p-(.+)$/, prefix: 'pr', expand: { pt: 'pt', pr: 'pr', pb: 'pb', pl: 'pl' } },
    paddingBottom: { shorthand: /^p-(.+)$/, prefix: 'pb', expand: { pt: 'pt', pr: 'pr', pb: 'pb', pl: 'pl' } },
    paddingLeft:   { shorthand: /^p-(.+)$/, prefix: 'pl', expand: { pt: 'pt', pr: 'pr', pb: 'pb', pl: 'pl' } },
    marginTop:     { shorthand: /^m-(.+)$/, prefix: 'mt', expand: { mt: 'mt', mr: 'mr', mb: 'mb', ml: 'ml' } },
    marginRight:   { shorthand: /^m-(.+)$/, prefix: 'mr', expand: { mt: 'mt', mr: 'mr', mb: 'mb', ml: 'ml' } },
    marginBottom:  { shorthand: /^m-(.+)$/, prefix: 'mb', expand: { mt: 'mt', mr: 'mr', mb: 'mb', ml: 'ml' } },
    marginLeft:    { shorthand: /^m-(.+)$/, prefix: 'ml', expand: { mt: 'mt', mr: 'mr', mb: 'mb', ml: 'ml' } },
  };

  const mapping = SHORTHAND_MAP[property];
  if (!mapping) { return null; }

  // Find a shorthand class
  for (const cls of currentClasses) {
    const match = cls.match(mapping.shorthand);
    if (match) {
      const currentValue = match[1];
      const expanded: string[] = [];

      for (const [, prefix] of Object.entries(mapping.expand)) {
        if (prefix === mapping.prefix) {
          expanded.push(`${prefix}-${newValue}`);
        } else {
          expanded.push(`${prefix}-${currentValue}`);
        }
      }

      return { oldClass: cls, newClasses: expanded };
    }
  }

  return null;
}
