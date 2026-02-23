// @ts-nocheck
/* global sendUpdate */

/**
 * Renders the Typography section with font controls.
 */
function renderTypographySection(typography, container) {
  const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
  const fontFamilies = ['sans', 'serif', 'mono'];
  const fontWeights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];
  const textAligns = ['left', 'center', 'right', 'justify'];
  const textTransforms = ['uppercase', 'lowercase', 'capitalize', 'normal-case'];

  container.innerHTML = `
    <div class="section">
      <div class="section-title" data-section="typography">
        <span><span class="section-icon typography">T</span> Typography</span>
        <span class="chevron">&#9662;</span>
      </div>
      <div class="section-body" id="typography-body">
        <div class="control-row">
          <span class="control-label">Font size</span>
          <div class="control-input">
            <select id="font-size-select">
              <option value="" ${!typography.fontSize ? 'selected' : ''}>-</option>
              ${fontSizes.map(s =>
                `<option value="${s}" ${typography.fontSize === s ? 'selected' : ''}>text-${s}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Font family</span>
          <div class="control-input">
            <select id="font-family-select">
              <option value="" ${!typography.fontFamily ? 'selected' : ''}>-</option>
              ${fontFamilies.map(f =>
                `<option value="${f}" ${typography.fontFamily === f ? 'selected' : ''}>font-${f}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Weight</span>
          <div class="control-input">
            <select id="font-weight-select">
              <option value="" ${!typography.fontWeight ? 'selected' : ''}>-</option>
              ${fontWeights.map(w =>
                `<option value="${w}" ${typography.fontWeight === w ? 'selected' : ''}>font-${w}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Align</span>
          <div class="control-input">
            <div class="chip-group">
              ${textAligns.map(a =>
                `<button class="chip ${typography.textAlign === a ? 'active' : ''}" data-value="${a}" data-type="textAlign">${a}</button>`
              ).join('')}
            </div>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Style</span>
          <div class="control-input">
            <div class="chip-group">
              <button class="chip ${typography.fontStyle === 'italic' ? 'active' : ''}" data-value="italic" data-type="fontStyle">italic</button>
              <button class="chip ${typography.textDecoration === 'underline' ? 'active' : ''}" data-value="underline" data-type="textDecoration">underline</button>
              <button class="chip ${typography.textDecoration === 'line-through' ? 'active' : ''}" data-value="line-through" data-type="textDecoration">strike</button>
            </div>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Transform</span>
          <div class="control-input">
            <div class="chip-group">
              ${textTransforms.map(t =>
                `<button class="chip ${typography.textTransform === t ? 'active' : ''}" data-value="${t}" data-type="textTransform">${t.replace('normal-case', 'none')}</button>`
              ).join('')}
            </div>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Line height</span>
          <div class="control-input">
            <select id="line-height-select">
              <option value="" ${!typography.lineHeight ? 'selected' : ''}>-</option>
              ${['none', 'tight', 'snug', 'normal', 'relaxed', 'loose', '3', '4', '5', '6', '7', '8', '9', '10'].map(l =>
                `<option value="${l}" ${typography.lineHeight === l ? 'selected' : ''}>leading-${l}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Spacing</span>
          <div class="control-input">
            <select id="letter-spacing-select">
              <option value="" ${!typography.letterSpacing ? 'selected' : ''}>-</option>
              ${['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'].map(t =>
                `<option value="${t}" ${typography.letterSpacing === t ? 'selected' : ''}>tracking-${t}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      </div>
    </div>
  `;

  // Select events
  attachSelectEvent(container, '#font-size-select', 'fontSize', 'text', typography.fontSize);
  attachSelectEvent(container, '#font-family-select', 'fontFamily', 'font', typography.fontFamily);
  attachSelectEvent(container, '#font-weight-select', 'fontWeight', 'font', typography.fontWeight);
  attachSelectEvent(container, '#line-height-select', 'lineHeight', 'leading', typography.lineHeight);
  attachSelectEvent(container, '#letter-spacing-select', 'letterSpacing', 'tracking', typography.letterSpacing);

  // Chip events
  container.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', function() {
      const type = this.dataset.type;
      const value = this.dataset.value;
      onTypographyChipClick(type, value, typography);
    });
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

function attachSelectEvent(container, selector, property, prefix, currentValue) {
  const select = container.querySelector(selector);
  if (!select) return;

  select.addEventListener('change', function() {
    const newVal = this.value;
    const oldClass = currentValue ? `${prefix}-${currentValue}` : null;

    if (newVal === '') {
      if (oldClass) {
        sendUpdate('typography', property, 'remove', oldClass, undefined);
      }
    } else if (oldClass) {
      sendUpdate('typography', property, 'replace', oldClass, `${prefix}-${newVal}`);
    } else {
      sendUpdate('typography', property, 'add', undefined, `${prefix}-${newVal}`);
    }
  });
}

function onTypographyChipClick(type, value, typography) {
  const currentVal = typography[type];

  // Map type to class patterns
  const classMap = {
    textAlign: { prefix: 'text', values: ['left', 'center', 'right', 'justify'] },
    textTransform: { prefix: '', values: ['uppercase', 'lowercase', 'capitalize', 'normal-case'] },
    fontStyle: { prefix: '', values: ['italic', 'not-italic'] },
    textDecoration: { prefix: '', values: ['underline', 'overline', 'line-through', 'no-underline'] },
  };

  const config = classMap[type];
  if (!config) return;

  const oldClass = currentVal || null;
  const newClass = config.prefix ? `${config.prefix}-${value}` : value;

  if (currentVal === value) {
    // Toggle off
    sendUpdate('typography', type, 'remove', oldClass, undefined);
  } else if (oldClass) {
    // Replace
    const oldClassFull = config.prefix ? `${config.prefix}-${oldClass}` : oldClass;
    sendUpdate('typography', type, 'replace', oldClassFull, newClass);
  } else {
    // Add
    sendUpdate('typography', type, 'add', undefined, newClass);
  }
}
