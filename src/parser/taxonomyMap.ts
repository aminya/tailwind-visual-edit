import { TailwindCategory } from '../types/categories';

interface TaxonomyRule {
  pattern: RegExp;
  category: TailwindCategory;
}

export const TAXONOMY_RULES: TaxonomyRule[] = [
  // ============================================================
  // LAYOUT
  // ============================================================
  { pattern: /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|table|table-row|table-cell|table-caption|table-column|table-column-group|table-footer-group|table-header-group|table-row-group|contents|list-item|hidden|flow-root)$/, category: TailwindCategory.Layout },
  { pattern: /^(static|fixed|absolute|relative|sticky)$/, category: TailwindCategory.Layout },
  { pattern: /^-?(top|right|bottom|left|inset|start|end)-/, category: TailwindCategory.Layout },
  { pattern: /^-?(top|right|bottom|left|inset|start|end)-/, category: TailwindCategory.Layout },
  { pattern: /^z-/, category: TailwindCategory.Layout },
  { pattern: /^(visible|invisible|collapse)$/, category: TailwindCategory.Layout },
  { pattern: /^overflow-/, category: TailwindCategory.Layout },
  { pattern: /^overscroll-/, category: TailwindCategory.Layout },
  { pattern: /^(flex-row|flex-col|flex-row-reverse|flex-col-reverse|flex-wrap|flex-wrap-reverse|flex-nowrap)$/, category: TailwindCategory.Layout },
  { pattern: /^(flex-1|flex-auto|flex-initial|flex-none)$/, category: TailwindCategory.Layout },
  { pattern: /^(grow|grow-0|shrink|shrink-0)$/, category: TailwindCategory.Layout },
  { pattern: /^basis-/, category: TailwindCategory.Layout },
  { pattern: /^order-/, category: TailwindCategory.Layout },
  { pattern: /^(justify|items|self|content|place)-/, category: TailwindCategory.Layout },
  { pattern: /^grid-cols-/, category: TailwindCategory.Layout },
  { pattern: /^grid-rows-/, category: TailwindCategory.Layout },
  { pattern: /^(col|row)-(span|start|end)-/, category: TailwindCategory.Layout },
  { pattern: /^(col-auto|row-auto)$/, category: TailwindCategory.Layout },
  { pattern: /^auto-(cols|rows)-/, category: TailwindCategory.Layout },
  { pattern: /^grid-flow-/, category: TailwindCategory.Layout },
  { pattern: /^(float|clear)-/, category: TailwindCategory.Layout },
  { pattern: /^(isolate|isolation-auto)$/, category: TailwindCategory.Layout },
  { pattern: /^object-(contain|cover|fill|none|scale-down|bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top)$/, category: TailwindCategory.Layout },
  { pattern: /^aspect-/, category: TailwindCategory.Layout },
  { pattern: /^columns-/, category: TailwindCategory.Layout },
  { pattern: /^break-(before|after|inside)-/, category: TailwindCategory.Layout },
  { pattern: /^box-(border|content|decoration)$/, category: TailwindCategory.Layout },
  { pattern: /^(container)$/, category: TailwindCategory.Layout },

  // ============================================================
  // SPACING
  // ============================================================
  { pattern: /^-?p[xytblrse]?-/, category: TailwindCategory.Spacing },
  { pattern: /^-?p-/, category: TailwindCategory.Spacing },
  { pattern: /^-?m[xytblrse]?-/, category: TailwindCategory.Spacing },
  { pattern: /^-?m-/, category: TailwindCategory.Spacing },
  { pattern: /^-?mx-auto$/, category: TailwindCategory.Spacing },
  { pattern: /^(gap|gap-x|gap-y)-/, category: TailwindCategory.Spacing },
  { pattern: /^(space-x|space-y)-/, category: TailwindCategory.Spacing },
  { pattern: /^(space-x-reverse|space-y-reverse)$/, category: TailwindCategory.Spacing },

  // ============================================================
  // SIZING
  // ============================================================
  { pattern: /^-?w-/, category: TailwindCategory.Sizing },
  { pattern: /^-?h-/, category: TailwindCategory.Sizing },
  { pattern: /^(min-w|max-w|min-h|max-h)-/, category: TailwindCategory.Sizing },
  { pattern: /^size-/, category: TailwindCategory.Sizing },

  // ============================================================
  // TYPOGRAPHY (must come before Colors to handle text- ambiguity)
  // ============================================================
  { pattern: /^font-(sans|serif|mono)$/, category: TailwindCategory.Typography },
  { pattern: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\d+)$/, category: TailwindCategory.Typography },
  { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/, category: TailwindCategory.Typography },
  { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\//, category: TailwindCategory.Typography },
  { pattern: /^text-(left|center|right|justify|start|end)$/, category: TailwindCategory.Typography },
  { pattern: /^text-(ellipsis|clip)$/, category: TailwindCategory.Typography },
  { pattern: /^text-(wrap|nowrap|balance|pretty)$/, category: TailwindCategory.Typography },
  { pattern: /^leading-/, category: TailwindCategory.Typography },
  { pattern: /^tracking-/, category: TailwindCategory.Typography },
  { pattern: /^(uppercase|lowercase|capitalize|normal-case)$/, category: TailwindCategory.Typography },
  { pattern: /^(italic|not-italic)$/, category: TailwindCategory.Typography },
  { pattern: /^(underline|overline|line-through|no-underline)$/, category: TailwindCategory.Typography },
  { pattern: /^decoration-/, category: TailwindCategory.Typography },
  { pattern: /^(underline-offset)-/, category: TailwindCategory.Typography },
  { pattern: /^truncate$/, category: TailwindCategory.Typography },
  { pattern: /^indent-/, category: TailwindCategory.Typography },
  { pattern: /^whitespace-/, category: TailwindCategory.Typography },
  { pattern: /^break-(normal|words|all|keep)$/, category: TailwindCategory.Typography },
  { pattern: /^hyphens-/, category: TailwindCategory.Typography },
  { pattern: /^align-/, category: TailwindCategory.Typography },
  { pattern: /^list-(none|disc|decimal|inside|outside)$/, category: TailwindCategory.Typography },
  { pattern: /^list-image-/, category: TailwindCategory.Typography },
  { pattern: /^(antialiased|subpixel-antialiased)$/, category: TailwindCategory.Typography },
  { pattern: /^(line-clamp)-/, category: TailwindCategory.Typography },

  // ============================================================
  // COLORS (text-{color} patterns come after typography text- patterns)
  // ============================================================
  { pattern: /^text-(\w+)-(\d+)(\/\d+)?$/, category: TailwindCategory.Colors },
  { pattern: /^text-(inherit|current|transparent|black|white)$/, category: TailwindCategory.Colors },
  { pattern: /^text-\[/, category: TailwindCategory.Colors },
  { pattern: /^bg-(inherit|current|transparent|black|white)$/, category: TailwindCategory.Colors },
  { pattern: /^bg-(\w+)-(\d+)/, category: TailwindCategory.Colors },
  { pattern: /^bg-\[/, category: TailwindCategory.Colors },
  { pattern: /^bg-gradient-/, category: TailwindCategory.Colors },
  { pattern: /^bg-none$/, category: TailwindCategory.Colors },
  { pattern: /^(from|via|to)-/, category: TailwindCategory.Colors },
  { pattern: /^accent-/, category: TailwindCategory.Colors },
  { pattern: /^caret-/, category: TailwindCategory.Colors },
  { pattern: /^(fill|stroke)-/, category: TailwindCategory.Colors },
  { pattern: /^placeholder-/, category: TailwindCategory.Colors },

  // ============================================================
  // BACKGROUNDS (non-color bg properties)
  // ============================================================
  { pattern: /^bg-(auto|cover|contain)$/, category: TailwindCategory.Colors },
  { pattern: /^bg-(fixed|local|scroll)$/, category: TailwindCategory.Colors },
  { pattern: /^bg-(bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top)$/, category: TailwindCategory.Colors },
  { pattern: /^bg-(repeat|no-repeat|repeat-x|repeat-y|repeat-round|repeat-space)$/, category: TailwindCategory.Colors },
  { pattern: /^bg-clip-/, category: TailwindCategory.Colors },
  { pattern: /^bg-origin-/, category: TailwindCategory.Colors },

  // ============================================================
  // BORDERS
  // ============================================================
  { pattern: /^border$/, category: TailwindCategory.Borders },
  { pattern: /^border-(0|2|4|8)$/, category: TailwindCategory.Borders },
  { pattern: /^border-[xytblrse]($|-\d)/, category: TailwindCategory.Borders },
  { pattern: /^border-(solid|dashed|dotted|double|hidden|none)$/, category: TailwindCategory.Borders },
  { pattern: /^border-(\w+)-(\d+)/, category: TailwindCategory.Borders },
  { pattern: /^border-(inherit|current|transparent|black|white)$/, category: TailwindCategory.Borders },
  { pattern: /^border-\[/, category: TailwindCategory.Borders },
  { pattern: /^border-collapse$/, category: TailwindCategory.Borders },
  { pattern: /^border-separate$/, category: TailwindCategory.Borders },
  { pattern: /^border-spacing-/, category: TailwindCategory.Borders },
  { pattern: /^rounded/, category: TailwindCategory.Borders },
  { pattern: /^ring/, category: TailwindCategory.Borders },
  { pattern: /^outline/, category: TailwindCategory.Borders },
  { pattern: /^divide-/, category: TailwindCategory.Borders },

  // ============================================================
  // EFFECTS
  // ============================================================
  { pattern: /^shadow/, category: TailwindCategory.Effects },
  { pattern: /^opacity-/, category: TailwindCategory.Effects },
  { pattern: /^(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow)/, category: TailwindCategory.Effects },
  { pattern: /^backdrop-/, category: TailwindCategory.Effects },
  { pattern: /^transition/, category: TailwindCategory.Effects },
  { pattern: /^duration-/, category: TailwindCategory.Effects },
  { pattern: /^(ease|delay)-/, category: TailwindCategory.Effects },
  { pattern: /^animate-/, category: TailwindCategory.Effects },
  { pattern: /^-?(scale|rotate|translate|skew)-/, category: TailwindCategory.Effects },
  { pattern: /^origin-/, category: TailwindCategory.Effects },
  { pattern: /^(transform|transform-gpu|transform-none)$/, category: TailwindCategory.Effects },
  { pattern: /^(mix-blend|bg-blend)-/, category: TailwindCategory.Effects },
  { pattern: /^(filter|backdrop-filter)$/, category: TailwindCategory.Effects },

  // ============================================================
  // INTERACTIVITY
  // ============================================================
  { pattern: /^cursor-/, category: TailwindCategory.Interactivity },
  { pattern: /^select-(none|text|all|auto)$/, category: TailwindCategory.Interactivity },
  { pattern: /^pointer-events-/, category: TailwindCategory.Interactivity },
  { pattern: /^resize/, category: TailwindCategory.Interactivity },
  { pattern: /^scroll-/, category: TailwindCategory.Interactivity },
  { pattern: /^snap-/, category: TailwindCategory.Interactivity },
  { pattern: /^touch-/, category: TailwindCategory.Interactivity },
  { pattern: /^appearance-/, category: TailwindCategory.Interactivity },
  { pattern: /^will-change-/, category: TailwindCategory.Interactivity },
  { pattern: /^(sr-only|not-sr-only)$/, category: TailwindCategory.Interactivity },
];
