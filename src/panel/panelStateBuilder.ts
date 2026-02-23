import { PanelState, SpacingState, TypographyState, ColorState, EffectsState, createEmptyPanelState } from '../types/panelState';
import { stripVariants } from '../parser/variantStripper';

/**
 * Builds a PanelState from a list of Tailwind classes.
 * Extracts structured values for each section (spacing, typography, colors, effects).
 */
export function buildPanelState(classes: string[], tagName: string | null): PanelState {
  const state = createEmptyPanelState();
  state.elementTag = tagName;
  state.allClasses = classes;
  state.cursorInClassAttribute = true;

  for (const cls of classes) {
    const base = stripVariants(cls);
    parseSpacing(base, state.spacing);
    parseTypography(base, state.typography);
    parseColor(base, state.color);
    parseEffects(base, state.effects);
  }

  return state;
}

function parseSpacing(cls: string, s: SpacingState): void {
  let match: RegExpMatchArray | null;

  // p-{value} (all sides)
  match = cls.match(/^p-(.+)$/);
  if (match && !cls.match(/^p[xytblrse]-/)) {
    s.paddingTop = s.paddingTop ?? match[1];
    s.paddingRight = s.paddingRight ?? match[1];
    s.paddingBottom = s.paddingBottom ?? match[1];
    s.paddingLeft = s.paddingLeft ?? match[1];
    return;
  }

  // px-{value}
  match = cls.match(/^px-(.+)$/);
  if (match) { s.paddingRight = match[1]; s.paddingLeft = match[1]; return; }

  // py-{value}
  match = cls.match(/^py-(.+)$/);
  if (match) { s.paddingTop = match[1]; s.paddingBottom = match[1]; return; }

  // pt, pr, pb, pl, ps, pe
  match = cls.match(/^pt-(.+)$/); if (match) { s.paddingTop = match[1]; return; }
  match = cls.match(/^pr-(.+)$/); if (match) { s.paddingRight = match[1]; return; }
  match = cls.match(/^pb-(.+)$/); if (match) { s.paddingBottom = match[1]; return; }
  match = cls.match(/^pl-(.+)$/); if (match) { s.paddingLeft = match[1]; return; }
  match = cls.match(/^ps-(.+)$/); if (match) { s.paddingLeft = match[1]; return; }
  match = cls.match(/^pe-(.+)$/); if (match) { s.paddingRight = match[1]; return; }

  // m-{value} (all sides)
  match = cls.match(/^-?m-(.+)$/);
  if (match && !cls.match(/^-?m[xytblrse]-/)) {
    const val = cls.startsWith('-') ? `-${match[1]}` : match[1];
    s.marginTop = s.marginTop ?? val;
    s.marginRight = s.marginRight ?? val;
    s.marginBottom = s.marginBottom ?? val;
    s.marginLeft = s.marginLeft ?? val;
    return;
  }

  // mx-{value}
  match = cls.match(/^-?mx-(.+)$/);
  if (match) {
    const val = cls.startsWith('-') ? `-${match[1]}` : match[1];
    s.marginRight = val; s.marginLeft = val; return;
  }

  // my-{value}
  match = cls.match(/^-?my-(.+)$/);
  if (match) {
    const val = cls.startsWith('-') ? `-${match[1]}` : match[1];
    s.marginTop = val; s.marginBottom = val; return;
  }

  // mt, mr, mb, ml
  match = cls.match(/^-?mt-(.+)$/);
  if (match) { s.marginTop = cls.startsWith('-') ? `-${match[1]}` : match[1]; return; }
  match = cls.match(/^-?mr-(.+)$/);
  if (match) { s.marginRight = cls.startsWith('-') ? `-${match[1]}` : match[1]; return; }
  match = cls.match(/^-?mb-(.+)$/);
  if (match) { s.marginBottom = cls.startsWith('-') ? `-${match[1]}` : match[1]; return; }
  match = cls.match(/^-?ml-(.+)$/);
  if (match) { s.marginLeft = cls.startsWith('-') ? `-${match[1]}` : match[1]; return; }

  // gap
  match = cls.match(/^gap-(.+)$/);
  if (match) { s.gap = match[1]; return; }
}

function parseTypography(cls: string, t: TypographyState): void {
  let match: RegExpMatchArray | null;

  // font size: text-{size}
  match = cls.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/);
  if (match) { t.fontSize = match[1]; return; }

  // font family
  match = cls.match(/^font-(sans|serif|mono)$/);
  if (match) { t.fontFamily = match[1]; return; }

  // font weight
  match = cls.match(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/);
  if (match) { t.fontWeight = match[1]; return; }

  // font style
  if (cls === 'italic') { t.fontStyle = 'italic'; return; }
  if (cls === 'not-italic') { t.fontStyle = 'normal'; return; }

  // line height
  match = cls.match(/^leading-(.+)$/);
  if (match) { t.lineHeight = match[1]; return; }

  // letter spacing
  match = cls.match(/^tracking-(.+)$/);
  if (match) { t.letterSpacing = match[1]; return; }

  // text transform
  if (['uppercase', 'lowercase', 'capitalize', 'normal-case'].includes(cls)) {
    t.textTransform = cls; return;
  }

  // text align
  match = cls.match(/^text-(left|center|right|justify|start|end)$/);
  if (match) { t.textAlign = match[1]; return; }

  // text decoration
  if (['underline', 'overline', 'line-through', 'no-underline'].includes(cls)) {
    t.textDecoration = cls; return;
  }
}

function parseColor(cls: string, c: ColorState): void {
  let match: RegExpMatchArray | null;

  // text color: text-{color}-{shade} or text-{namedColor}
  match = cls.match(/^text-(\w+-\d+(?:\/\d+)?)$/);
  if (match) { c.textColor = match[1]; return; }
  match = cls.match(/^text-(inherit|current|transparent|black|white)$/);
  if (match) { c.textColor = match[1]; return; }
  match = cls.match(/^text-\[(.+)\]$/);
  if (match) { c.textColor = match[1]; return; }

  // background color
  match = cls.match(/^bg-(\w+-\d+(?:\/\d+)?)$/);
  if (match) { c.backgroundColor = match[1]; return; }
  match = cls.match(/^bg-(inherit|current|transparent|black|white)$/);
  if (match) { c.backgroundColor = match[1]; return; }
  match = cls.match(/^bg-\[(.+)\]$/);
  if (match) { c.backgroundColor = match[1]; return; }
}

function parseEffects(cls: string, e: EffectsState): void {
  let match: RegExpMatchArray | null;

  // border radius
  match = cls.match(/^rounded(?:-(none|sm|md|lg|xl|2xl|3xl|full))?$/);
  if (match) { e.borderRadius = match[1] || 'DEFAULT'; return; }

  // shadow
  match = cls.match(/^shadow(?:-(none|sm|md|lg|xl|2xl|inner))?$/);
  if (match) { e.shadow = match[1] || 'DEFAULT'; return; }

  // opacity
  match = cls.match(/^opacity-(\d+)$/);
  if (match) { e.opacity = match[1]; return; }

  // border width
  if (cls === 'border') { e.borderWidth = 'DEFAULT'; return; }
  match = cls.match(/^border-(0|2|4|8)$/);
  if (match) { e.borderWidth = match[1]; return; }

  // border style
  match = cls.match(/^border-(solid|dashed|dotted|double|hidden|none)$/);
  if (match) { e.borderStyle = match[1]; return; }

  // border color
  match = cls.match(/^border-(\w+-\d+)$/);
  if (match) { e.borderColor = match[1]; return; }
  match = cls.match(/^border-(inherit|current|transparent|black|white)$/);
  if (match) { e.borderColor = match[1]; return; }
}
