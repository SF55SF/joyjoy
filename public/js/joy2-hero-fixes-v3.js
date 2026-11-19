/* JOY2 hero fixes v3 */
(()=>{
  const READY_DELAY=550;
  const INTERVAL=4000;
  function onReady(fn){ if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(fn,READY_DELAY),{once:true}); else setTimeout(fn,READY_DELAY); }
  function stripIds(node){ if(!(node instanceof Element)) return; if(node.hasAttribute('id')) node.removeAttribute('id'); node.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id')); }
  function ensureLayout(hero){
    let left=hero.querySelector(':scope > .jj-hero-left-v2');
    let right=hero.querySelector(':scope > .jj-hero-right-v2');
    if(!left){
      left=document.createElement('div');
      left.className='jj-hero-left-v2';
      const kids=[...hero.children].filter(el=>!el.classList.contains('jj-hero-right-v2'));
      kids.forEach(el=>left.appendChild(el));
      hero.prepend(left);
    }
    if(!right){
      right=document.createElement('div');
      right.className='jj-hero-right-v2';
      hero.appendChild(right);
    }
    let backdrop=right.querySelector(':scope > .jj-hero-stage-backdrop-v3');
    if(!backdrop){
      backdrop=document.createElement('div');
      backdrop.className='jj-hero-stage-backdrop-v3';
      right.appendChild(backdrop);
    }
    let viewport=backdrop.querySelector(':scope > .jj-hero-rotator-v3');
    if(!viewport){
      viewport=document.createElement('div');
      viewport.className='jj-hero-rotator-v3';
      backdrop.appendChild(viewport);
    }
    hero.classList.add('jj-hero-layout-v3');
    return {left,right,backdrop,viewport};
  }
  function swapActions(left){
    const actions=left.querySelector('.jj-ref-actions');
    if(!actions) return;
    const buttons=[...actions.querySelectorAll(':scope > a')];
    if(buttons.length<2) return;
    const first=buttons[0], second=buttons[1];
    const firstLooksInvest=/investment=1/.test(first.getAttribute('href')||'') || /Инвестиц|Investits|Investment/i.test(first.textContent||'');
    const secondLooksAll=/^#catalog$/.test(second.getAttribute('href')||'') || /Все объекты|Barcha obyektlar|All properties/i.test(second.textContent||'');
    if(firstLooksInvest && secondLooksAll){ actions.insertBefore(second, first); }
  }
  function buildSlides(viewport, sourceCards){
    viewport.innerHTML='';
    sourceCards.forEach((original,index)=>{
      const slide=document.createElement('div');
      slide.className='jj-hero-slide-v3';
      slide.hidden=index!==0;
      const clone=original.cloneNode(true);
      stripIds(clone);
      clone.removeAttribute('style');
      clone.querySelectorAll('[style]').forEach(el=>el.removeAttribute('style'));
      clone.querySelectorAll('img').forEach(img=>{img.loading='eager'; img.decoding='async';});
      slide.appendChild(clone);
      viewport.appendChild(slide);
    });
    return [...viewport.children];
  }
  function startCarousel(stage, slides){
    if(stage.__joy2HeroV3){ stage.__joy2HeroV3.stop?.(); }
    let current=0, busy=false, timer=0;
    const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(nextIndex){
      if(busy || nextIndex===current || !slides[nextIndex]) return;
      const oldSlide=slides[current], nextSlide=slides[nextIndex];
      if(reduce){ oldSlide.hidden=true; nextSlide.hidden=false; current=nextIndex; return; }
      busy=true;
      nextSlide.hidden=false;
      nextSlide.classList.add('joy2-pre-v3');
      void nextSlide.offsetWidth;
      oldSlide.classList.add('joy2-out-v3');
      nextSlide.classList.remove('joy2-pre-v3');
      nextSlide.classList.add('joy2-in-v3');
      window.setTimeout(()=>{
        oldSlide.hidden=true;
        oldSlide.classList.remove('joy2-out-v3');
        nextSlide.classList.remove('joy2-in-v3');
        current=nextIndex;
        busy=false;
      },760);
    }
    function stop(){ if(timer){ clearInterval(timer); timer=0; } }
    function play(){ stop(); if(slides.length<2) return; timer=setInterval(()=>show((current+1)%slides.length),INTERVAL); }
    stage.addEventListener('mouseenter',stop);
    stage.addEventListener('mouseleave',play);
    stage.addEventListener('focusin',stop);
    stage.addEventListener('focusout',()=>setTimeout(()=>{ if(!stage.contains(document.activeElement)) play(); },0));
    document.addEventListener('visibilitychange',()=>{ if(document.hidden) stop(); else play(); });
    stage.__joy2HeroV3={stop};
    play();
  }
  function boot(){
    const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
    const grid=document.getElementById('jj-results');
    if(!hero || !grid) return;
    const sourceCards=[...grid.querySelectorAll('.jj-property-card[data-investment="true"]')];
    if(!sourceCards.length){ setTimeout(boot,700); return; }
    const {left,right,backdrop,viewport}=ensureLayout(hero);
    swapActions(left);
    right.setAttribute('aria-label', document.documentElement.lang==='en' ? 'Investment offers' : document.documentElement.lang==='uz' ? 'Investitsiya takliflari' : 'Инвестиционные предложения');
    const slides=buildSlides(viewport, sourceCards);
    startCarousel(backdrop, slides);
  }
  onReady(boot);
})();
