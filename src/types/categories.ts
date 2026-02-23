export enum TailwindCategory {
  Layout = 'layout',
  Spacing = 'spacing',
  Sizing = 'sizing',
  Typography = 'typography',
  Colors = 'colors',
  Borders = 'borders',
  Effects = 'effects',
  Interactivity = 'interactivity',
  Unknown = 'unknown',
}

export interface CategoryColors {
  light: { color: string };
  dark: { color: string };
}

export const CATEGORY_COLOR_MAP: Record<TailwindCategory, CategoryColors> = {
  [TailwindCategory.Layout]: {
    light: { color: '#c2410c' },
    dark: { color: '#fb923c' },
  },
  [TailwindCategory.Spacing]: {
    light: { color: '#1d4ed8' },
    dark: { color: '#60a5fa' },
  },
  [TailwindCategory.Sizing]: {
    light: { color: '#0e7490' },
    dark: { color: '#22d3ee' },
  },
  [TailwindCategory.Typography]: {
    light: { color: '#7e22ce' },
    dark: { color: '#c084fc' },
  },
  [TailwindCategory.Colors]: {
    light: { color: '#15803d' },
    dark: { color: '#4ade80' },
  },
  [TailwindCategory.Borders]: {
    light: { color: '#a16207' },
    dark: { color: '#facc15' },
  },
  [TailwindCategory.Effects]: {
    light: { color: '#be185d' },
    dark: { color: '#f472b6' },
  },
  [TailwindCategory.Interactivity]: {
    light: { color: '#4b5563' },
    dark: { color: '#9ca3af' },
  },
  [TailwindCategory.Unknown]: {
    light: { color: 'inherit' },
    dark: { color: 'inherit' },
  },
};

export const CATEGORY_LABELS: Record<TailwindCategory, string> = {
  [TailwindCategory.Layout]: 'Layout',
  [TailwindCategory.Spacing]: 'Spacing',
  [TailwindCategory.Sizing]: 'Sizing',
  [TailwindCategory.Typography]: 'Typography',
  [TailwindCategory.Colors]: 'Colors',
  [TailwindCategory.Borders]: 'Borders',
  [TailwindCategory.Effects]: 'Effects',
  [TailwindCategory.Interactivity]: 'Interactivity',
  [TailwindCategory.Unknown]: 'Other',
};
