/* JOY2 HERO BUTTONS + EXACT CARD V5 */
(()=>{
  const DELAY_MS = 1400;
  const LOOP_MS = 4000;
  function onReady(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>setTimeout(fn, DELAY_MS), {once:true});
    else setTimeout(fn, DELAY_MS);
  }
  function stripIds(node){
    if(!(node instanceof Element)) return;
    if(node.hasAttribute('id')) node.removeAttribute('id');
    node.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  }
  function boot(){
    const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
    const right=hero?.querySelector(':scope > .jj-hero-right-v2');
    const actions=hero?.querySelector('.jj-hero-left-v2 .jj-ref-actions');
    const results=document.getElementById('jj-results');
    if(!hero || !right || !actions || !results) return;

    // Swap visual order only once if needed.
    const links=[...actions.querySelectorAll(':scope > a.jj-ref-cta')];
    if(links.length>=2){
      const allBtn = links.find(a => (a.getAttribute('href')||'') === '#catalog');
      const investBtn = links.find(a => /investment=1/.test(a.getAttribute('href')||''));
      if(allBtn && investBtn && allBtn.nextElementSibling !== investBtn){
        actions.insertBefore(allBtn, investBtn);
      }
    }

    // Rebuild the hero card rotator from the final rendered catalog cards.
    const sourceCards=[...results.querySelectorAll('.jj-property-card[data-investment="true"]')].filter(card=>!card.closest('.jj-hero-right-v2'));
    if(!sourceCards.length){ setTimeout(boot, 900); return; }

    right.innerHTML='';
    const shell=document.createElement('div');
    shell.className='jj-hero-rotator-shell-v5';
    const viewport=document.createElement('div');
    viewport.className='jj-hero-rotator-v5';
    shell.appendChild(viewport);
    right.appendChild(shell);

    const heights=sourceCards.map(card=>Math.ceil(card.getBoundingClientRect().height)).filter(Boolean);
    const cardHeight=Math.max(...heights, 0);
    if(cardHeight>0) viewport.style.height=cardHeight+'px';

    const slides=[];
    sourceCards.forEach((original,index)=>{
      const slide=document.createElement('div');
      slide.className='jj-hero-slide-v5';
      slide.hidden=index!==0;
      const clone=original.cloneNode(true);
      stripIds(clone);
      clone.querySelectorAll('img').forEach(img=>{ img.loading='eager'; img.decoding='async'; });
      slide.appendChild(clone);
      viewport.appendChild(slide);
      slides.push(slide);
    });

    if(!slides.length) return;
    let current=0, busy=false;
    let timer=0;
    const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(nextIndex){
      if(busy || nextIndex===current || !slides[nextIndex]) return;
      const oldSlide=slides[current], nextSlide=slides[nextIndex];
      if(reduce){ oldSlide.hidden=true; nextSlide.hidden=false; current=nextIndex; return; }
      busy=true;
      nextSlide.hidden=false;
      nextSlide.classList.add('joy2-pre-v5');
      void nextSlide.offsetWidth;
      oldSlide.classList.add('joy2-out-v5');
      nextSlide.classList.remove('joy2-pre-v5');
      nextSlide.classList.add('joy2-in-v5');
      window.setTimeout(()=>{
        oldSlide.hidden=true;
        oldSlide.classList.remove('joy2-out-v5');
        nextSlide.classList.remove('joy2-in-v5');
        current=nextIndex;
        busy=false;
      },760);
    }
    function stop(){ if(timer){ clearInterval(timer); timer=0; } }
    function play(){ stop(); if(slides.length<2) return; timer=setInterval(()=>show((current+1)%slides.length), LOOP_MS); }
    shell.addEventListener('mouseenter',stop);
    shell.addEventListener('mouseleave',play);
    shell.addEventListener('focusin',stop);
    shell.addEventListener('focusout',()=>setTimeout(()=>{ if(!shell.contains(document.activeElement)) play(); },0));
    document.addEventListener('visibilitychange',()=>{ if(document.hidden) stop(); else play(); });
    play();
  }
  onReady(boot);
})();
