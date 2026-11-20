/* JOY2_V118_DAHO_GALLERY_SAFETY — limited to DAHO; no global observers */
(() => {
  const pathname = window.location.pathname || '';
  if (!/\/listing\/daho-block-e\/?$/i.test(pathname)) return;
  const disableDahoZoom = () => {
    const root = document.querySelector('.jj-detail');
    if (!root) return;
    root.querySelectorAll('.jj-gallery-launch, .jj-detail-gallery-side [data-gallery-index]').forEach(button => {
      button.style.cursor = 'default';
      button.querySelectorAll('img').forEach(img => { img.style.cursor = 'default'; });
      if (button.dataset.joy2V118Disabled === '1') return;
      button.dataset.joy2V118Disabled = '1';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
      }, true);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', disableDahoZoom, {once: true});
  else disableDahoZoom();
})();
