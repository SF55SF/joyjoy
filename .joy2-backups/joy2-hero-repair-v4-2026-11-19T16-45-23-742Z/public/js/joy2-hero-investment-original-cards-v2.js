/* JOY2 HERO CAROUSEL V2 — uses unchanged published catalog cards. */
(() => {
  function boot() {
    const hero = document.querySelector('main.jj-ref-home > .jj-ref-hero');
    const grid = document.getElementById('jj-results');
    if (!hero || !grid || hero.dataset.joy2CarouselV2 === '1') return;
    const actions = hero.querySelector(':scope > .jj-ref-actions');
    const heading = hero.querySelector(':scope > h1');
    if (!actions || !heading) return;
    const copy = document.createElement('div');
    copy.className = 'jj-hero-left-v2';
    for (const element of [...hero.children]) {
      if (element.classList.contains('jj-hero-right-v2')) continue;
      copy.appendChild(element);
    }
    hero.appendChild(copy);
    hero.classList.add('jj-hero-layout-v2');
    hero.dataset.joy2CarouselV2 = '1';

    const sourceCards = [...grid.querySelectorAll('.jj-property-card[data-investment="true"]')];
    if (!sourceCards.length) return;
    const stage = document.createElement('div');
    stage.className = 'jj-hero-right-v2';
    stage.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Investment offers' : document.documentElement.lang === 'uz' ? 'Investitsiya takliflari' : 'Инвестиционные предложения');
    const viewport = document.createElement('div');
    viewport.className = 'jj-hero-rotator-v2';
    stage.appendChild(viewport);
    for (const [index, original] of sourceCards.entries()) {
      const slide = document.createElement('div');
      slide.className = 'jj-hero-slide-v2';
      slide.dataset.index = String(index);
      slide.hidden = index !== 0;
      const card = original.cloneNode(true);
      card.removeAttribute('id');
      card.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      card.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      // The real card stays in the catalog. This detached copy is read-only.
      card.querySelectorAll('button, input, select').forEach(node => node.remove());
      slide.appendChild(card);
      viewport.appendChild(slide);
    }
    hero.appendChild(stage);
    const slides = [...viewport.children];
    if (slides.length === 1) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0, busy = false, interval;
    function next() {
      if (busy || document.hidden) return;
      const old = slides[current];
      const idx = (current + 1) % slides.length;
      const upcoming = slides[idx];
      if (reduce) {
        old.hidden = true;
        upcoming.hidden = false;
        current = idx;
        return;
      }
      busy = true;
      upcoming.hidden = false;
      upcoming.classList.add('joy2-pre-v2');
      void upcoming.offsetWidth;
      old.classList.add('joy2-out-v2');
      upcoming.classList.remove('joy2-pre-v2');
      upcoming.classList.add('joy2-in-v2');
      setTimeout(() => {
        old.hidden = true;
        old.classList.remove('joy2-out-v2');
        upcoming.classList.remove('joy2-in-v2');
        current = idx;
        busy = false;
      }, 760);
    }
    const pause = () => { clearInterval(interval); interval = undefined; };
    const play = () => { pause(); interval = setInterval(next, 4000); };
    stage.addEventListener('mouseenter', pause);
    stage.addEventListener('mouseleave', play);
    stage.addEventListener('focusin', pause);
    stage.addEventListener('focusout', () => { if (!stage.contains(document.activeElement)) play(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else play(); });
    play();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 450), {once:true});
  else setTimeout(boot, 450);
})();
