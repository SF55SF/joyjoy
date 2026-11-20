/* JOY2_EXACT_MILLIONS_V117 — exact data binding, only KPI amounts */
(() => {
  const locale = (document.documentElement.lang || 'ru').toLowerCase().startsWith('ru') ? 'ru-RU' : 'en-US';
  const format = n => (n < 0 ? '−' : '') + '$' + (Math.abs(n) / 1000000).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' млн';

  function apply() {
    document.querySelectorAll('.jj-detail .jj-unit-finance-drawer [data-joy2-exact-usd-v117]').forEach(el => {
      const n = Number(el.getAttribute('data-joy2-exact-usd-v117'));
      if (!Number.isFinite(n)) return;
      const required = format(n);
      if (el.textContent !== required) el.textContent = required;
    });
  }

  const start = () => {
    apply();
    const root = document.querySelector('.jj-detail');
    if (root && !root.dataset.joy2ExactMillionsV117) {
      root.dataset.joy2ExactMillionsV117 = '1';
      const observer = new MutationObserver(records => {
        if (records.some(record => record.type === 'childList' || record.type === 'attributes' && record.attributeName === 'data-joy2-exact-usd-v117')) {
          apply();
        }
      });
      observer.observe(root, { subtree: true, childList: true });
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  document.addEventListener('click', e => {
    if (e.target.closest('[data-jj-unit-select]')) setTimeout(apply, 0);
  });
})();