/* JOY2_CARD_MATCH_REFERENCE_V1 — no changes to filtering, finance or favorites */
(() => {
  function mount() {
    const grid = document.getElementById('jj-results');
    const data = document.getElementById('jj-card-match-data');
    if (!grid || !data) return;
    let items;
    try { items = JSON.parse(data.textContent); } catch { return; }
    if (!Array.isArray(items)) return;
    const lookup = new Map(items.map(item => [item.slug, item]));
    const lang = (document.documentElement.lang || 'ru').slice(0, 2);
    const t = {
      ru: { area: 'Площадь', price: 'Цена', status: 'Статус объекта', existing: 'Существующий', construction: 'Строящийся', irr: 'IRR', profit: 'Прибыль проекта', invest: 'Инвестиционный расчёт' },
      uz: { area: 'Maydon', price: 'Narx', status: 'Obyekt holati', existing: 'Mavjud', construction: 'Qurilmoqda', irr: 'IRR', profit: 'Loyiha foydasi', invest: 'Investitsiya hisobi' },
      en: { area: 'Area', price: 'Price', status: 'Property status', existing: 'Existing', construction: 'Under construction', irr: 'IRR', profit: 'Project profit', invest: 'Investment analysis' }
    }[lang] || { area: 'Area', price: 'Price', status: 'Property status', existing: 'Existing', construction: 'Under construction', irr: 'IRR', profit: 'Project profit', invest: 'Investment analysis' };
    const elem = (tag, className, value) => {
      const e = document.createElement(tag);
      e.className = className;
      if (value !== undefined) e.textContent = value;
      return e;
    };
    const metric = (label, value) => {
      const e = elem('div', 'jj-match-metric');
      e.append(elem('span', 'jj-match-metric-label', label), elem('strong', 'jj-match-metric-value', value));
      return e;
    };
    const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
    const irrFormat = new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    for (const card of grid.querySelectorAll('.jj-property-card')) {
      if (card.dataset.jjMatchV1 === '1') continue;
      const info = lookup.get(card.dataset.slug);
      if (!info) continue;
      const body = card.querySelector('.jj-property-card-main');
      const overline = body?.querySelector('.jj-card-overline');
      const heading = body?.querySelector('h3');
      const oldSummary = body?.querySelector('.jj-property-summary');
      const oldAddress = body?.querySelector('.jj-property-address');
      const image = card.querySelector('.jj-property-card-image');
      if (!body || !overline || !heading || !oldSummary || !oldAddress || !image) continue;
      const areaNumber = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'ru-RU', {maximumFractionDigits:0});
      const a0 = areaNumber.format(info.areaMin);
      const a1 = areaNumber.format(info.areaMax);
      const area = (info.areaMin === info.areaMax ? a0 : a0 + ' – ' + a1) + ' м²';
      const price = info.priceMode === 'perSqm'
        ? (lang === 'en' ? 'from ' : lang === 'uz' ? 'dan ' : 'от ') + nf.format(info.priceValue) + ' $/м²'
        : info.priceMode === 'total' ? '$' + nf.format(info.priceValue)
        : (lang === 'en' ? 'Price on request' : lang === 'uz' ? 'Narx so‘rov asosida' : 'Цена по запросу');
      const summary = elem('div', 'jj-property-summary jj-match-summary');
      summary.append(metric(t.area, area), metric(t.price, price));
      const panel = elem('div', 'jj-match-bottom');
      if (info.investment && Number.isFinite(info.irr) && Number.isFinite(info.profit)) {
        panel.classList.add('jj-match-bottom-invest');
        panel.append(metric(t.irr, irrFormat.format(info.irr) + '%'), metric(t.profit, '$' + nf.format(info.profit)));
      } else {
        panel.classList.add('jj-match-bottom-status');
        panel.append(metric(t.status, info.status === 'under_construction' ? t.construction : t.existing));
      }
      // Rebuild only the presentational content. Reuse the real title, category and address.
      body.replaceChildren(overline, heading, summary, oldAddress, panel);
      card.querySelectorAll('.jj-invest-ribbon, .jj-label-status').forEach(node => node.remove());
      if (info.investment) {
        const badge = elem('span', 'jj-invest-ribbon jj-match-ribbon', t.invest);
        image.append(badge);
      }
      card.dataset.jjMatchV1 = '1';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();

/* JOY2_HERO_FAST_AREA_SPACING_V88 */
