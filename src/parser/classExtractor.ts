import * as vscode from 'vscode';

export interface ClassOccurrence {
  className: string;
  range: vscode.Range;
  attributeRange: vscode.Range;
  fullAttributeValue: string;
}

export interface ClassAttributeAtCursor {
  value: string;
  range: vscode.Range;
  classes: string[];
  tagName: string | null;
}

// Patterns to match class attribute values
const CLASS_ATTR_PATTERNS = [
  // className="..." or className={'...'}
  /className\s*=\s*"([^"]+)"/g,
  /className\s*=\s*'([^']+)'/g,
  /className\s*=\s*\{'([^']+)'\}/g,
  /className\s*=\s*\{"([^"]+)"\}/g,
  // class="..." (HTML)
  /\bclass\s*=\s*"([^"]+)"/g,
  /\bclass\s*=\s*'([^']+)'/g,
  // cn(...) clsx(...) cva(...) twMerge(...) — first string argument
  /(?:cn|clsx|cva|twMerge|twJoin)\(\s*"([^"]+)"/g,
  /(?:cn|clsx|cva|twMerge|twJoin)\(\s*'([^']+)'/g,
  // className={`...`} template literals (simple, no expressions)
  /className\s*=\s*\{`([^`]+)`\}/g,
];

/**
 * Extract all individual Tailwind class occurrences from a document,
 * with their exact positions for decoration.
 */
export function extractClassOccurrences(document: vscode.TextDocument): ClassOccurrence[] {
  const text = document.getText();
  const occurrences: ClassOccurrence[] = [];

  for (const pattern of CLASS_ATTR_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = regex.exec(text)) !== null) {
      const classListString = attrMatch[1];
      const classListOffset = attrMatch.index + attrMatch[0].indexOf(classListString);
      const attrStartPos = document.positionAt(classListOffset);
      const attrEndPos = document.positionAt(classListOffset + classListString.length);
      const attributeRange = new vscode.Range(attrStartPos, attrEndPos);

      // Split into individual classes
      const classTokens = classListString.split(/\s+/).filter(c => c.length > 0);
      let searchOffset = 0;

      for (const token of classTokens) {
        const tokenIndex = classListString.indexOf(token, searchOffset);
        if (tokenIndex === -1) { continue; }

        const absoluteOffset = classListOffset + tokenIndex;
        const startPos = document.positionAt(absoluteOffset);
        const endPos = document.positionAt(absoluteOffset + token.length);

        occurrences.push({
          className: token,
          range: new vscode.Range(startPos, endPos),
          attributeRange,
          fullAttributeValue: classListString,
        });

        searchOffset = tokenIndex + token.length;
      }
    }
  }

  return occurrences;
}

/**
 * Find the className/class attribute at or near the cursor position.
 * Also tries to detect the enclosing HTML/JSX tag name.
 */
export function findClassAttributeAtCursor(
  document: vscode.TextDocument,
  position: vscode.Position
): ClassAttributeAtCursor | null {
  const text = document.getText();
  const offset = document.offsetAt(position);

  for (const pattern of CLASS_ATTR_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const valueStr = match[1];
      const valueOffset = match.index + match[0].indexOf(valueStr);
      const valueEnd = valueOffset + valueStr.length;

      // Check if cursor is within the full match range (attribute + value)
      if (offset >= match.index && offset <= match.index + match[0].length) {
        const startPos = document.positionAt(valueOffset);
        const endPos = document.positionAt(valueEnd);
        const tagName = findEnclosingTagName(text, match.index);

        return {
          value: valueStr,
          range: new vscode.Range(startPos, endPos),
          classes: valueStr.split(/\s+/).filter(c => c.length > 0),
          tagName,
        };
      }
    }
  }

  // If cursor is not directly on a className, try to find the nearest one
  // by scanning the current line and nearby lines
  return findNearestClassAttribute(document, position);
}

/**
 * Find the enclosing HTML/JSX tag name by scanning backward from a position.
 */
function findEnclosingTagName(text: string, fromOffset: number): string | null {
  // Scan backward to find the opening < of the tag
  let i = fromOffset;
  while (i > 0) {
    if (text[i] === '<' && text[i + 1] !== '/') {
      // Found opening tag, extract tag name
      const tagMatch = text.substring(i).match(/^<([a-zA-Z][a-zA-Z0-9.]*)/);
      if (tagMatch) {
        return tagMatch[1];
      }
      break;
    }
    if (text[i] === '>') {
      break; // We crossed a tag boundary
    }
    i--;
  }
  return null;
}

/**
 * If cursor is inside a JSX/HTML tag but not directly on className,
 * find the className attribute of that tag.
 */
function findNearestClassAttribute(
  document: vscode.TextDocument,
  position: vscode.Position
): ClassAttributeAtCursor | null {
  const text = document.getText();
  const offset = document.offsetAt(position);

  // Find the enclosing tag by scanning backward for <
  let tagStart = offset;
  let depth = 0;
  while (tagStart > 0) {
    if (text[tagStart] === '>' && tagStart !== offset) { depth++; }
    if (text[tagStart] === '<' && text[tagStart + 1] !== '/') {
      if (depth === 0) { break; }
      depth--;
    }
    tagStart--;
  }

  if (tagStart <= 0) { return null; }

  // Find the end of this tag (the closing >)
  let tagEnd = offset;
  while (tagEnd < text.length) {
    if (text[tagEnd] === '>') { break; }
    tagEnd++;
  }

  if (tagEnd >= text.length) { return null; }

  // Extract the tag content and search for className/class within it
  const tagContent = text.substring(tagStart, tagEnd + 1);

  for (const pattern of CLASS_ATTR_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(tagContent)) !== null) {
      const valueStr = match[1];
      const valueOffset = tagStart + match.index + match[0].indexOf(valueStr);
      const startPos = document.positionAt(valueOffset);
      const endPos = document.positionAt(valueOffset + valueStr.length);
      const tagName = findEnclosingTagName(text, tagStart);

      return {
        value: valueStr,
        range: new vscode.Range(startPos, endPos),
        classes: valueStr.split(/\s+/).filter(c => c.length > 0),
        tagName,
      };
    }
  }

  return null;
}
