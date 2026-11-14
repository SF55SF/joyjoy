/* JOYJOY_UNSLOP_STAGE1_V1 — progressive enhancement; original filtering remains intact. */
(() => {
  const form = document.getElementById('jj-filters');
  if (!form || form.dataset.unslopStage1 === 'ready') return;
  form.dataset.unslopStage1 = 'ready';
  const language = document.documentElement.lang || 'ru';
  const copy = language.startsWith('en')
    ? {more:'All filters',less:'Hide filters',selected:'active'}
    : language.startsWith('uz')
      ? {more:'Barcha filtrlar',less:'Filtrlarni yopish',selected:'tanlangan'}
      : {more:'Все фильтры',less:'Скрыть фильтры',selected:'выбрано'};

  const extraIds = ['jj-area-max', 'jj-price-min', 'jj-unknown', 'jj-status'];
  const targets = extraIds.map(id => document.getElementById(id)?.closest('label')).filter(Boolean);
  if (!targets.length) return;
  const details = document.createElement('div');
  details.id = 'jj-advanced-filters';
  details.className = 'jj-advanced-filters';
  details.hidden = true;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'jj-more-filters';
  button.setAttribute('aria-controls', details.id);
  button.setAttribute('aria-expanded', 'false');
  const buttonLabel = document.createElement('span');
  buttonLabel.textContent = copy.more;
  const counter = document.createElement('small');
  counter.className = 'jj-filter-counter';
  counter.hidden = true;
  button.append(buttonLabel, counter);
  targets.forEach(label => {
    label.classList.add('jj-advanced-field');
    details.appendChild(label);
  });
  form.append(button, details);

  const active = () => extraIds.reduce((count,id) => {
    const input = document.getElementById(id);
    if (!input) return count;
    if (input.type === 'checkbox') return count + (input.checked === false ? 1 : 0);
    return count + (input.value !== '' ? 1 : 0);
  }, 0);
  const refresh = () => {
    const n = active();
    counter.hidden = !n;
    counter.textContent = n + ' ' + copy.selected;
  };
  const toggle = (open) => {
    details.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    buttonLabel.textContent = open ? copy.less : copy.more;
  };
  button.addEventListener('click', () => toggle(details.hidden));
  form.addEventListener('input', refresh);
  form.addEventListener('change', refresh);
  form.addEventListener('reset', () => queueMicrotask(() => { refresh(); toggle(false); }));
  refresh();
  if (active() > 0) toggle(true);

  // Neutralize only typographic labels: no change to listing data or original filters.
  document.querySelectorAll('.jj-property-card').forEach(card => {
    const title = card.querySelector('.jj-property-card h3 a');
    if (title) title.setAttribute('title', title.textContent.trim());
  });
})();
