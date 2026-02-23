// @ts-nocheck
/* global sendUpdate */

/**
 * Renders the Effects section (border radius, shadow, opacity, border).
 */
function renderEffectsSection(effects, container) {
  const radiusOptions = ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
  const shadowOptions = ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', 'inner'];
  const borderWidths = ['0', 'DEFAULT', '2', '4', '8'];
  const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'none'];

  const opacityVal = effects.opacity ? parseInt(effects.opacity) : 100;

  container.innerHTML = `
    <div class="section">
      <div class="section-title" data-section="effects">
        <span><span class="section-icon effects">E</span> Effects</span>
        <span class="chevron">&#9662;</span>
      </div>
      <div class="section-body" id="effects-body">
        <div class="control-row">
          <span class="control-label">Radius</span>
          <div class="control-input">
            <select id="border-radius-select">
              <option value="" ${!effects.borderRadius ? 'selected' : ''}>-</option>
              ${radiusOptions.map(r => {
                const label = r === 'DEFAULT' ? 'rounded' : `rounded-${r}`;
                return `<option value="${r}" ${effects.borderRadius === r ? 'selected' : ''}>${label}</option>`;
              }).join('')}
            </select>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Shadow</span>
          <div class="control-input">
            <select id="shadow-select">
              <option value="" ${!effects.shadow ? 'selected' : ''}>-</option>
              ${shadowOptions.map(s => {
                const label = s === 'DEFAULT' ? 'shadow' : `shadow-${s}`;
                return `<option value="${s}" ${effects.shadow === s ? 'selected' : ''}>${label}</option>`;
              }).join('')}
            </select>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Opacity</span>
          <div class="slider-row" style="flex:1;">
            <input type="range" id="opacity-slider" min="0" max="100" step="5" value="${opacityVal}">
            <span class="slider-value" id="opacity-value">${opacityVal}</span>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Border</span>
          <div class="control-input">
            <select id="border-width-select">
              <option value="" ${!effects.borderWidth ? 'selected' : ''}>-</option>
              ${borderWidths.map(w => {
                const label = w === 'DEFAULT' ? 'border' : `border-${w}`;
                return `<option value="${w}" ${effects.borderWidth === w ? 'selected' : ''}>${label}</option>`;
              }).join('')}
            </select>
          </div>
        </div>

        <div class="control-row">
          <span class="control-label">Style</span>
          <div class="control-input">
            <div class="chip-group">
              ${borderStyles.map(s =>
                `<button class="chip ${effects.borderStyle === s ? 'active' : ''}" data-value="${s}" data-type="borderStyle">${s}</button>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Border radius
  const radiusSelect = container.querySelector('#border-radius-select');
  if (radiusSelect) {
    radiusSelect.addEventListener('change', function() {
      const newVal = this.value;
      const oldClass = effects.borderRadius
        ? (effects.borderRadius === 'DEFAULT' ? 'rounded' : `rounded-${effects.borderRadius}`)
        : null;
      const newClass = newVal
        ? (newVal === 'DEFAULT' ? 'rounded' : `rounded-${newVal}`)
        : null;

      if (!newVal && oldClass) {
        sendUpdate('effects', 'borderRadius', 'remove', oldClass, undefined);
      } else if (oldClass) {
        sendUpdate('effects', 'borderRadius', 'replace', oldClass, newClass);
      } else if (newClass) {
        sendUpdate('effects', 'borderRadius', 'add', undefined, newClass);
      }
    });
  }

  // Shadow
  const shadowSelect = container.querySelector('#shadow-select');
  if (shadowSelect) {
    shadowSelect.addEventListener('change', function() {
      const newVal = this.value;
      const oldClass = effects.shadow
        ? (effects.shadow === 'DEFAULT' ? 'shadow' : `shadow-${effects.shadow}`)
        : null;
      const newClass = newVal
        ? (newVal === 'DEFAULT' ? 'shadow' : `shadow-${newVal}`)
        : null;

      if (!newVal && oldClass) {
        sendUpdate('effects', 'shadow', 'remove', oldClass, undefined);
      } else if (oldClass) {
        sendUpdate('effects', 'shadow', 'replace', oldClass, newClass);
      } else if (newClass) {
        sendUpdate('effects', 'shadow', 'add', undefined, newClass);
      }
    });
  }

  // Opacity slider
  const opacitySlider = container.querySelector('#opacity-slider');
  const opacityDisplay = container.querySelector('#opacity-value');
  if (opacitySlider) {
    opacitySlider.addEventListener('input', function() {
      opacityDisplay.textContent = this.value;
    });
    opacitySlider.addEventListener('change', function() {
      const newVal = this.value;
      const oldClass = effects.opacity ? `opacity-${effects.opacity}` : null;

      if (newVal === '100') {
        if (oldClass) {
          sendUpdate('effects', 'opacity', 'remove', oldClass, undefined);
        }
      } else if (oldClass) {
        sendUpdate('effects', 'opacity', 'replace', oldClass, `opacity-${newVal}`);
      } else {
        sendUpdate('effects', 'opacity', 'add', undefined, `opacity-${newVal}`);
      }
    });
  }

  // Border width
  const borderWidthSelect = container.querySelector('#border-width-select');
  if (borderWidthSelect) {
    borderWidthSelect.addEventListener('change', function() {
      const newVal = this.value;
      const oldClass = effects.borderWidth
        ? (effects.borderWidth === 'DEFAULT' ? 'border' : `border-${effects.borderWidth}`)
        : null;
      const newClass = newVal
        ? (newVal === 'DEFAULT' ? 'border' : `border-${newVal}`)
        : null;

      if (!newVal && oldClass) {
        sendUpdate('effects', 'borderWidth', 'remove', oldClass, undefined);
      } else if (oldClass) {
        sendUpdate('effects', 'borderWidth', 'replace', oldClass, newClass);
      } else if (newClass) {
        sendUpdate('effects', 'borderWidth', 'add', undefined, newClass);
      }
    });
  }

  // Border style chips
  container.querySelectorAll('.chip[data-type="borderStyle"]').forEach(chip => {
    chip.addEventListener('click', function() {
      const newVal = this.dataset.value;
      const oldClass = effects.borderStyle ? `border-${effects.borderStyle}` : null;

      if (effects.borderStyle === newVal) {
        // Toggle off
        if (oldClass) {
          sendUpdate('effects', 'borderStyle', 'remove', oldClass, undefined);
        }
      } else if (oldClass) {
        sendUpdate('effects', 'borderStyle', 'replace', oldClass, `border-${newVal}`);
      } else {
        sendUpdate('effects', 'borderStyle', 'add', undefined, `border-${newVal}`);
      }
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
