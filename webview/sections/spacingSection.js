// @ts-nocheck
/* global sendUpdate */

/**
 * Renders the Spacing section with an interactive box model visualization.
 */
function renderSpacingSection(spacing, container) {
  const values = {
    mt: spacing.marginTop || '',
    mr: spacing.marginRight || '',
    mb: spacing.marginBottom || '',
    ml: spacing.marginLeft || '',
    pt: spacing.paddingTop || '',
    pr: spacing.paddingRight || '',
    pb: spacing.paddingBottom || '',
    pl: spacing.paddingLeft || '',
    gap: spacing.gap || '',
  };

  container.innerHTML = `
    <div class="section">
      <div class="section-title" data-section="spacing">
        <span><span class="section-icon spacing">S</span> Spacing</span>
        <span class="chevron">&#9662;</span>
      </div>
      <div class="section-body" id="spacing-body">
        <div class="spacing-box-container">
          <div class="spacing-box">
            <div class="margin-layer">
              <span class="layer-label">margin</span>
              <input class="spacing-input top-input" value="${values.mt}" placeholder="-" data-prop="marginTop" data-prefix="mt">
              <input class="spacing-input right-input" value="${values.mr}" placeholder="-" data-prop="marginRight" data-prefix="mr">
              <input class="spacing-input bottom-input" value="${values.mb}" placeholder="-" data-prop="marginBottom" data-prefix="mb">
              <input class="spacing-input left-input" value="${values.ml}" placeholder="-" data-prop="marginLeft" data-prefix="ml">
              <div class="padding-layer">
                <span class="layer-label">padding</span>
                <input class="spacing-input top-input" value="${values.pt}" placeholder="-" data-prop="paddingTop" data-prefix="pt">
                <input class="spacing-input right-input" value="${values.pr}" placeholder="-" data-prop="paddingRight" data-prefix="pr">
                <input class="spacing-input bottom-input" value="${values.pb}" placeholder="-" data-prop="paddingBottom" data-prefix="pb">
                <input class="spacing-input left-input" value="${values.pl}" placeholder="-" data-prop="paddingLeft" data-prefix="pl">
                <span class="element-label">element</span>
              </div>
            </div>
          </div>
        </div>
        <div class="control-row">
          <span class="control-label">Gap</span>
          <div class="control-input">
            <select id="gap-select">
              <option value="" ${!values.gap ? 'selected' : ''}>none</option>
              ${[0,0.5,1,1.5,2,2.5,3,3.5,4,5,6,7,8,9,10,11,12,14,16,20,24,28,32,36,40,44,48,52,56,60,64,72,80,96].map(v =>
                `<option value="${v}" ${values.gap === String(v) ? 'selected' : ''}>gap-${v}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach events for spacing inputs
  container.querySelectorAll('.spacing-input').forEach(input => {
    input.addEventListener('change', function() {
      onSpacingInputChange(this);
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        this.blur();
      }
    });
  });

  // Attach event for gap select
  const gapSelect = container.querySelector('#gap-select');
  if (gapSelect) {
    gapSelect.addEventListener('change', function() {
      const val = this.value;
      if (val) {
        sendUpdate('spacing', 'gap', 'replace', spacing.gap ? `gap-${spacing.gap}` : undefined, `gap-${val}`);
      } else if (spacing.gap) {
        sendUpdate('spacing', 'gap', 'remove', `gap-${spacing.gap}`, undefined);
      }
    });
  }

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

function onSpacingInputChange(input) {
  const prop = input.dataset.prop;
  const prefix = input.dataset.prefix;
  const newVal = input.value.trim();

  if (!prop || !prefix) return;

  // Determine the current class for this property
  const currentState = window.__currentState;
  if (!currentState) return;

  const currentVal = currentState.spacing[prop];
  const oldClass = currentVal ? `${prefix}-${currentVal}` : null;

  if (newVal === '' || newVal === '-') {
    // Remove the class
    if (oldClass) {
      sendUpdate('spacing', prop, 'remove', oldClass, undefined);
    }
  } else if (oldClass) {
    // Replace existing class
    sendUpdate('spacing', prop, 'replace', oldClass, `${prefix}-${newVal}`);
  } else {
    // Add new class
    sendUpdate('spacing', prop, 'add', undefined, `${prefix}-${newVal}`);
  }
}
