// @ts-nocheck
/* global renderSpacingSection, renderTypographySection, renderColorSection, renderEffectsSection */

/**
 * Main webview script for Tailwind Visual Edit panel.
 * Handles messages from the extension and orchestrates section rendering.
 */

// Acquire the VS Code API
const vscode = acquireVsCodeApi();

// Store current state globally for section modules to access
window.__currentState = null;

/**
 * Category mapping for class chip coloring.
 */
const CATEGORY_RULES = [
  // Layout
  { pattern: /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|table|hidden|flow-root|static|fixed|absolute|relative|sticky|container)$/, category: 'layout' },
  { pattern: /^(overflow|overscroll|z|float|clear|isolat|object|aspect|columns|break-|box-|flex-|grow|shrink|basis-|order-|justify|items|self|content|place|grid|col-|row-|auto-)/, category: 'layout' },
  { pattern: /^-?(top|right|bottom|left|inset|start|end)-/, category: 'layout' },
  { pattern: /^(visible|invisible|collapse)$/, category: 'layout' },
  // Spacing
  { pattern: /^-?[mp][xytblrse]?-/, category: 'spacing' },
  { pattern: /^(gap|space)-/, category: 'spacing' },
  // Sizing
  { pattern: /^-?(w|h)-/, category: 'sizing' },
  { pattern: /^(min-w|max-w|min-h|max-h|size)-/, category: 'sizing' },
  // Typography
  { pattern: /^font-/, category: 'typography' },
  { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/, category: 'typography' },
  { pattern: /^text-(left|center|right|justify|start|end|ellipsis|clip|wrap|nowrap|balance|pretty)$/, category: 'typography' },
  { pattern: /^(leading|tracking)-/, category: 'typography' },
  { pattern: /^(uppercase|lowercase|capitalize|normal-case|italic|not-italic|underline|overline|line-through|no-underline|truncate|antialiased|subpixel-antialiased)$/, category: 'typography' },
  { pattern: /^(decoration|indent|whitespace|break-|hyphens-|align-|list-|line-clamp)/, category: 'typography' },
  // Colors
  { pattern: /^text-(\w+)-(\d+)/, category: 'colors' },
  { pattern: /^text-(inherit|current|transparent|black|white)$/, category: 'colors' },
  { pattern: /^(bg|from|via|to|accent|caret|fill|stroke|placeholder)-/, category: 'colors' },
  // Borders
  { pattern: /^(border|rounded|ring|outline|divide)/, category: 'borders' },
  // Effects
  { pattern: /^(shadow|opacity|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|backdrop|transition|duration|ease|delay|animate|scale|rotate|translate|skew|origin|transform|mix-blend|bg-blend|filter)/, category: 'effects' },
  // Interactivity
  { pattern: /^(cursor|select-|pointer-events|resize|scroll|snap|touch|appearance|will-change|sr-only|not-sr-only)/, category: 'interactivity' },
];

function categorizeClassForChip(className) {
  // Strip variants
  const base = className.includes(':') ? className.split(':').pop() : className;
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(base)) {
      return rule.category;
    }
  }
  return 'unknown';
}

// Listen for messages from the extension
window.addEventListener('message', (event) => {
  const message = event.data;
  switch (message.type) {
    case 'updateState':
      window.__currentState = message.payload;
      renderState(message.payload);
      break;
    case 'noElementSelected':
      showNoSelection();
      break;
  }
});

function renderState(state) {
  document.getElementById('no-selection').style.display = 'none';
  document.getElementById('editor-sections').style.display = 'block';

  // Element info header
  const info = document.getElementById('element-info');
  const tagBadge = state.elementTag ? `<span class="tag-badge">&lt;${state.elementTag}&gt;</span>` : '';
  info.innerHTML = `${tagBadge} <span class="class-count">${state.allClasses.length} class${state.allClasses.length !== 1 ? 'es' : ''}</span>`;

  // Classes preview with colored chips
  const preview = document.getElementById('classes-preview');
  preview.innerHTML = state.allClasses.map(cls => {
    const cat = categorizeClassForChip(cls);
    return `<span class="class-chip ${cat}" title="${cat}">${cls}</span>`;
  }).join('');

  // Render each section
  renderSpacingSection(state.spacing, document.getElementById('section-spacing'));
  renderTypographySection(state.typography, document.getElementById('section-typography'));
  renderColorSection(state.color, document.getElementById('section-color'));
  renderEffectsSection(state.effects, document.getElementById('section-effects'));
}

function showNoSelection() {
  document.getElementById('no-selection').style.display = 'block';
  document.getElementById('editor-sections').style.display = 'none';
  window.__currentState = null;
}

/**
 * Send a class update message to the extension.
 */
function sendUpdate(category, property, action, oldClass, newClass) {
  vscode.postMessage({
    type: 'updateClass',
    payload: { category, property, action, oldClass, newClass },
  });
}

// Notify extension that webview is ready
vscode.postMessage({ type: 'ready' });
