// @ts-nocheck
/* global sendUpdate */

/**
 * Tailwind color palette for the color picker
 */
const TAILWIND_COLORS = {
  slate:   ['#f8fafc','#f1f5f9','#e2e8f0','#cbd5e1','#94a3b8','#64748b','#475569','#334155','#1e293b','#0f172a','#020617'],
  gray:    ['#f9fafb','#f3f4f6','#e5e7eb','#d1d5db','#9ca3af','#6b7280','#4b5563','#374151','#1f2937','#111827','#030712'],
  zinc:    ['#fafafa','#f4f4f5','#e4e4e7','#d4d4d8','#a1a1aa','#71717a','#52525b','#3f3f46','#27272a','#18181b','#09090b'],
  neutral: ['#fafafa','#f5f5f5','#e5e5e5','#d4d4d4','#a3a3a3','#737373','#525252','#404040','#262626','#171717','#0a0a0a'],
  stone:   ['#fafaf9','#f5f5f4','#e7e5e3','#d6d3d1','#a8a29e','#78716c','#57534e','#44403c','#292524','#1c1917','#0c0a09'],
  red:     ['#fef2f2','#fee2e2','#fecaca','#fca5a5','#f87171','#ef4444','#dc2626','#b91c1c','#991b1b','#7f1d1d','#450a0a'],
  orange:  ['#fff7ed','#ffedd5','#fed7aa','#fdba74','#fb923c','#f97316','#ea580c','#c2410c','#9a3412','#7c2d12','#431407'],
  amber:   ['#fffbeb','#fef3c7','#fde68a','#fcd34d','#fbbf24','#f59e0b','#d97706','#b45309','#92400e','#78350f','#451a03'],
  yellow:  ['#fefce8','#fef9c3','#fef08a','#fde047','#facc15','#eab308','#ca8a04','#a16207','#854d0e','#713f12','#422006'],
  lime:    ['#f7fee7','#ecfccb','#d9f99d','#bef264','#a3e635','#84cc16','#65a30d','#4d7c0f','#3f6212','#365314','#1a2e05'],
  green:   ['#f0fdf4','#dcfce7','#bbf7d0','#86efac','#4ade80','#22c55e','#16a34a','#15803d','#166534','#14532d','#052e16'],
  emerald: ['#ecfdf5','#d1fae5','#a7f3d0','#6ee7b7','#34d399','#10b981','#059669','#047857','#065f46','#064e3b','#022c22'],
  teal:    ['#f0fdfa','#ccfbf1','#99f6e4','#5eead4','#2dd4bf','#14b8a6','#0d9488','#0f766e','#115e59','#134e4a','#042f2e'],
  cyan:    ['#ecfeff','#cffafe','#a5f3fc','#67e8f9','#22d3ee','#06b6d4','#0891b2','#0e7490','#155e75','#164e63','#083344'],
  sky:     ['#f0f9ff','#e0f2fe','#bae6fd','#7dd3fc','#38bdf8','#0ea5e9','#0284c7','#0369a1','#075985','#0c4a6e','#082f49'],
  blue:    ['#eff6ff','#dbeafe','#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af','#1e3a8a','#172554'],
  indigo:  ['#eef2ff','#e0e7ff','#c7d2fe','#a5b4fc','#818cf8','#6366f1','#4f46e5','#4338ca','#3730a3','#312e81','#1e1b4b'],
  violet:  ['#f5f3ff','#ede9fe','#ddd6fe','#c4b5fd','#a78bfa','#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95','#2e1065'],
  purple:  ['#faf5ff','#f3e8ff','#e9d5ff','#d8b4fe','#c084fc','#a855f7','#9333ea','#7e22ce','#6b21a8','#581c87','#3b0764'],
  fuchsia: ['#fdf4ff','#fae8ff','#f5d0fe','#f0abfc','#e879f9','#d946ef','#c026d3','#a21caf','#86198f','#701a75','#4a044e'],
  pink:    ['#fdf2f8','#fce7f3','#fbcfe8','#f9a8d4','#f472b6','#ec4899','#db2777','#be185d','#9d174d','#831843','#500724'],
  rose:    ['#fff1f2','#ffe4e6','#fecdd3','#fda4af','#fb7185','#f43f5e','#e11d48','#be123c','#9f1239','#881337','#4c0519'],
};

const SHADE_VALUES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function renderColorSection(color, container) {
  const textColorDisplay = color.textColor || '';
  const bgColorDisplay = color.backgroundColor || '';
  const textHex = tailwindColorToHex(color.textColor);
  const bgHex = tailwindColorToHex(color.backgroundColor);

  container.innerHTML = `
    <div class="section">
      <div class="section-title" data-section="color">
        <span><span class="section-icon colors">C</span> Color</span>
        <span class="chevron">&#9662;</span>
      </div>
      <div class="section-body" id="color-body">
        <div class="control-row">
          <span class="control-label">Text</span>
          <div class="color-row">
            <div class="color-swatch" id="text-color-swatch"
              style="background: ${textHex || 'transparent'}"></div>
            <div class="color-value-input">
              <input type="text" id="text-color-input" value="${textColorDisplay}"
                placeholder="e.g. red-500">
            </div>
          </div>
        </div>
        <div class="color-palette hidden" id="text-color-palette"></div>

        <div class="control-row" style="margin-top: 8px;">
          <span class="control-label">Background</span>
          <div class="color-row">
            <div class="color-swatch" id="bg-color-swatch"
              style="background: ${bgHex || 'transparent'}"></div>
            <div class="color-value-input">
              <input type="text" id="bg-color-input" value="${bgColorDisplay}"
                placeholder="e.g. blue-100">
            </div>
          </div>
        </div>
        <div class="color-palette hidden" id="bg-color-palette"></div>
      </div>
    </div>
  `;

  // Build palette grids
  buildPalette(container.querySelector('#text-color-palette'), 'text', color.textColor);
  buildPalette(container.querySelector('#bg-color-palette'), 'bg', color.backgroundColor);

  // Swatch click toggles palette
  container.querySelector('#text-color-swatch').addEventListener('click', () => {
    container.querySelector('#text-color-palette').classList.toggle('hidden');
    container.querySelector('#bg-color-palette').classList.add('hidden');
  });
  container.querySelector('#bg-color-swatch').addEventListener('click', () => {
    container.querySelector('#bg-color-palette').classList.toggle('hidden');
    container.querySelector('#text-color-palette').classList.add('hidden');
  });

  // Input change events
  container.querySelector('#text-color-input').addEventListener('change', function() {
    const newVal = this.value.trim();
    applyColorChange('text', 'textColor', color.textColor, newVal);
  });
  container.querySelector('#bg-color-input').addEventListener('change', function() {
    const newVal = this.value.trim();
    applyColorChange('bg', 'backgroundColor', color.backgroundColor, newVal);
  });

  // Toggle section
  const title = container.querySelector('.section-title');
  const body = container.querySelector('.section-body');
  if (title && body) {
    title.addEventListener('click', function() {
      this.classList.toggle('collapsed');
      body.classList.toggle('hidden');
    });
  }
}

function buildPalette(paletteEl, prefix, currentValue) {
  if (!paletteEl) return;

  let html = '';
  for (const [colorName, shades] of Object.entries(TAILWIND_COLORS)) {
    shades.forEach((hex, index) => {
      const shade = SHADE_VALUES[index];
      const classValue = `${colorName}-${shade}`;
      const isActive = currentValue === classValue;
      html += `<div class="palette-swatch ${isActive ? 'active' : ''}"
        style="background: ${hex}"
        data-color="${classValue}" data-prefix="${prefix}"
        title="${prefix}-${classValue}"></div>`;
    });
  }
  paletteEl.innerHTML = html;

  // Click events
  paletteEl.querySelectorAll('.palette-swatch').forEach(swatch => {
    swatch.addEventListener('click', function() {
      const colorVal = this.dataset.color;
      const pfx = this.dataset.prefix;
      const property = pfx === 'text' ? 'textColor' : 'backgroundColor';
      const currentState = window.__currentState;
      const oldVal = currentState ? currentState.color[property] : null;
      applyColorChange(pfx, property, oldVal, colorVal);
    });
  });
}

function applyColorChange(prefix, property, currentValue, newValue) {
  const oldClass = currentValue ? `${prefix}-${currentValue}` : null;

  if (!newValue || newValue === '') {
    if (oldClass) {
      sendUpdate('colors', property, 'remove', oldClass, undefined);
    }
  } else if (oldClass) {
    sendUpdate('colors', property, 'replace', oldClass, `${prefix}-${newValue}`);
  } else {
    sendUpdate('colors', property, 'add', undefined, `${prefix}-${newValue}`);
  }
}

function tailwindColorToHex(colorStr) {
  if (!colorStr) return null;

  const namedColors = {
    'black': '#000000', 'white': '#ffffff', 'transparent': 'transparent',
    'inherit': null, 'current': null,
  };
  if (namedColors[colorStr] !== undefined) return namedColors[colorStr];

  // Parse "colorName-shade" format
  const match = colorStr.match(/^(\w+)-(\d+)$/);
  if (!match) return null;

  const [, name, shade] = match;
  const palette = TAILWIND_COLORS[name];
  if (!palette) return null;

  const shadeIndex = SHADE_VALUES.indexOf(parseInt(shade));
  if (shadeIndex === -1) return null;

  return palette[shadeIndex];
}
