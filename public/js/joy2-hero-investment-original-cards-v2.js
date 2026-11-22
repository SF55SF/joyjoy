/* JOY2 ORIGINAL CATALOG CARD ROTATOR V6 — one real DOM clone per slide. */
(()=>{
  // JOY2_V249: one mobile owner. Height-only viewport changes must not restart
  // the carousel or move the heading; the approved desktop rotator stays intact.
  const mobileMedia=matchMedia('(max-width:900px)');
  const ownsMobile=()=>document.documentElement.toggleAttribute('data-joy2-mobile-hero-v249',mobileMedia.matches&&!!document.querySelector('main.jj-ref-home > .jj-ref-hero'));
  ownsMobile();mobileMedia.addEventListener('change',ownsMobile);
  const mobileImages=new WeakMap();
  function deferMobileImages(card){
    card.querySelectorAll('img').forEach(img=>{
      if(!mobileImages.has(img))mobileImages.set(img,{src:img.getAttribute('src'),srcset:img.getAttribute('srcset')});
      img.removeAttribute('srcset');img.removeAttribute('src');
      img.loading='lazy';img.decoding='async';img.fetchPriority='low';
    });
  }
  function activateMobileImages(card,initial){
    card.querySelectorAll('img').forEach(img=>{
      const source=mobileImages.get(img);if(!source)return;
      img.loading='eager';img.decoding='async';img.fetchPriority=initial?'high':'auto';
      if(source.srcset!==null)img.setAttribute('srcset',source.srcset);
      if(source.src!==null)img.setAttribute('src',source.src);
      mobileImages.delete(img);
    });
  }
  function mobileController({hero,stage,viewport,slides,getCurrent,setCurrent}){
    let enabled=false,lastWidth=0,pending=false,controls=null;
    const savedHeight={value:viewport.style.getPropertyValue('height'),priority:viewport.style.getPropertyPriority('height')};
    const savedId=viewport.getAttribute('id');
    const heading=hero.querySelector('.jj-hero-left-v2 > h1');
    const save=(el,names)=>names.map(name=>({name,value:el?.style.getPropertyValue(name)||'',priority:el?.style.getPropertyPriority(name)||''}));
    const restore=(el,values)=>{if(!el)return;values.forEach(p=>p.value?el.style.setProperty(p.name,p.value,p.priority):el.style.removeProperty(p.name));};
    const stageGeometry=save(stage,['width','zoom']),headingGeometry=save(heading,['top','translate','transform']);
    const language=document.documentElement.lang;
    const words=language==='en'?['Previous offer','Next offer','Investment offers']:language==='uz'?['Oldingi taklif','Keyingi taklif','Investitsiya takliflari']:['Предыдущее предложение','Следующее предложение','Инвестиционные предложения'];
    function show(index,initial=false){
      if(!enabled)return;
      const next=(index+slides.length)%slides.length;
      // Permanent nodes: switching only changes visibility and restores the exact
      // original URL of the newly requested image. No clone/layout/scroll here.
      slides.forEach((slide,i)=>{
        slide.hidden=i!==next;slide.setAttribute('aria-hidden',String(i!==next));
        slide.toggleAttribute('inert',i!==next);
        slide.classList.remove('joy2-out-v6','joy2-in-v6','joy2-pre-v6');
      });
      setCurrent(next);activateMobileImages(slides[next].querySelector('.jj-property-card'),initial);
    }
    function alignHeading(){
      const heading=hero.querySelector('.jj-hero-left-v2 > h1'),logo=document.querySelector('header.jj-ref-header .jj-brand-logo');
      if(!heading||!logo)return;
      heading.style.setProperty('top','0px','important');heading.style.setProperty('translate','none','important');heading.style.setProperty('transform','none','important');
      const title=heading.getBoundingClientRect(),brand=logo.getBoundingClientRect(),card=stage.getBoundingClientRect();
      const dx=card.left-title.left,free=card.top-brand.bottom;
      const dy=(free>title.height+12?(brand.bottom+card.top-title.height)/2-title.top:0)+10;
      if([dx,dy].every(Number.isFinite))heading.style.setProperty('transform','translate('+dx.toFixed(2)+'px,'+dy.toFixed(2)+'px)','important');
    }
    function measure(){
      pending=false;if(!enabled)return;
      const width=document.documentElement.clientWidth;
      if(width===lastWidth)return;lastWidth=width;
      // Resolve the original minimum once for this real width/orientation, then
      // pin it. Collapsing browser chrome / keyboard height cannot stretch Hero.
      hero.style.removeProperty('--joy2-v249-min-height');
      const minimum=parseFloat(getComputedStyle(hero).minHeight)||0;
      hero.style.setProperty('--joy2-v249-min-height',minimum+'px');
      stage.style.setProperty('width','390px','important');
      stage.style.setProperty('zoom',String(Math.min(1,hero.clientWidth/390)),'important');
      // All three original cards are measured in one synchronous pass before
      // paint. Images have reserved geometry; no hidden photo is requested.
      stage.setAttribute('data-joy2-v249-measuring','');
      let maximum=0;
      slides.forEach(slide=>{const card=slide.querySelector('.jj-property-card');if(card)maximum=Math.max(maximum,card.scrollHeight,card.offsetHeight);});
      stage.removeAttribute('data-joy2-v249-measuring');
      const height=Math.ceil(Math.max(maximum,380)/8)*8+16;
      viewport.style.setProperty('height',height+'px','important');
      alignHeading();
    }
    function queue(){if(!enabled||pending||lastWidth===document.documentElement.clientWidth)return;pending=true;requestAnimationFrame(measure);}
    function enter(){
      if(enabled)return;enabled=true;lastWidth=0;stage.dataset.joy2MobileV249='1';
      slides.forEach(slide=>{const card=slide.querySelector('.jj-property-card');if(card)deferMobileImages(card);});
      viewport.id='joy2-hero-rotator-v249';
      if(!controls){
        controls=document.createElement('div');controls.className='jj-hero-controls-v249';controls.setAttribute('role','group');controls.setAttribute('aria-label',words[2]);
        /* JOY2_V250_REMOVE_COUNTER */ const previous=document.createElement('button'),next=document.createElement('button');
        previous.type=next.type='button';/* JOY2_V252_PRO_ARROWS: crisp SVG icons, no font-glyph fallback on mobile. */
        const arrowSvg=(right)=>'<svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="'+(right?'M5 15H25M17 7L25 15L17 23':'M25 15H5M13 7L5 15L13 23')+'" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        previous.innerHTML=arrowSvg(false);next.innerHTML=arrowSvg(true);
        previous.setAttribute('aria-label',words[0]);next.setAttribute('aria-label',words[1]);
        previous.setAttribute('aria-controls',viewport.id);next.setAttribute('aria-controls',viewport.id);
        previous.addEventListener('click',()=>show(getCurrent()-1));next.addEventListener('click',()=>show(getCurrent()+1));
        controls.append(previous,next);stage.append(controls);
      }
      controls.hidden=slides.length<2;
      measure();show(getCurrent(),true);
    }
    function leave(){
      if(!enabled)return;enabled=false;pending=false;delete stage.dataset.joy2MobileV249;
      hero.style.removeProperty('--joy2-v249-min-height');
      restore(stage,stageGeometry);restore(heading,headingGeometry);
      // V190's mobile-only inline font must not leak into the approved desktop.
      if(heading?.style.getPropertyValue('font-size').includes('40.9975'))heading.style.removeProperty('font-size');
      if(savedHeight.value)viewport.style.setProperty('height',savedHeight.value,savedHeight.priority);else viewport.style.removeProperty('height');
      if(savedId===null)viewport.removeAttribute('id');else viewport.id=savedId;
      if(controls)controls.hidden=true;
      slides.forEach(slide=>{slide.removeAttribute('aria-hidden');slide.removeAttribute('inert');const card=slide.querySelector('.jj-property-card');if(card)activateMobileImages(card,false);});
    }
    window.addEventListener('resize',queue,{passive:true});
    return {enter,leave};
  }
  function init(){
    const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
    const grid=document.getElementById('jj-results');
    if(!hero||!grid||hero.dataset.joy2CarouselV6==='1')return;
    const actions=hero.querySelector(':scope > .jj-ref-actions, :scope > .jj-hero-left-v2 > .jj-ref-actions');
    const heading=hero.querySelector(':scope > h1, :scope > .jj-hero-left-v2 > h1');
    if(!actions||!heading)return;
    const originals=[...grid.querySelectorAll('.jj-property-card[data-investment="true"]')];
    if(!originals.length)return;
    let left=hero.querySelector(':scope > .jj-hero-left-v2');
    if(!left){
      left=document.createElement('div');left.className='jj-hero-left-v2';
      [...hero.children].filter(x=>!x.classList.contains('jj-hero-right-v2')).forEach(x=>left.appendChild(x));
      hero.prepend(left);
    }
    let stage=hero.querySelector(':scope > .jj-hero-right-v2');
    if(!stage){stage=document.createElement('div');stage.className='jj-hero-right-v2';hero.append(stage);}
    stage.setAttribute('aria-label',document.documentElement.lang==='en'?'Investment offers':document.documentElement.lang==='uz'?'Investitsiya takliflari':'Инвестиционные предложения');
    // Remove any previous carousel and its extra shells; keep a single stage.
    stage.replaceChildren();
    stage.classList.add('jj-hero-stage-v6');
    const viewport=document.createElement('div');viewport.className='jj-hero-rotator-v6';stage.appendChild(viewport);
    hero.classList.add('jj-hero-layout-v2');
    hero.dataset.joy2CarouselV2='1';hero.dataset.joy2CarouselV6='1';

    // Preserve computed styles of the original rendered cards. They are styled by
    // #catalog-results selectors that do not normally apply outside the catalog.
    function copyOriginalAppearance(source,clone){
      /* JOY2_V166_MOBILE_NO_COMPUTED_COPY: keep original card CSS, do not snapshot already-shrunk mobile styles. */
      if(typeof matchMedia==='function'&&matchMedia('(max-width:900px)').matches){clone.style.removeProperty('zoom');return;}

      const a=[source,...source.querySelectorAll('*')],b=[clone,...clone.querySelectorAll('*')];
      for(let i=0;i<a.length&&i<b.length;i++){
        const sourceStyle=getComputedStyle(a[i]);
        let declaration='';
        for(let n=0;n<sourceStyle.length;n++){
          const prop=sourceStyle[n];
          if(prop==='position'||prop==='inset'||prop==='top'||prop==='left'||prop==='right'||prop==='bottom'||prop==='z-index')continue;
          declaration+=prop+':'+sourceStyle.getPropertyValue(prop)+';';
        }
        b[i].style.cssText=declaration;
      }
    }
    /* JOY2_HERO_HEADING_ADDRESS_V78: preserve normal catalog card, only fix copied address in hero. */
    const copyAppearanceV78=copyOriginalAppearance;
    copyOriginalAppearance=function(source,clone){
      copyAppearanceV78(source,clone);
      const address=clone.querySelector('.jj-property-address');
      const container=clone.querySelector('.jj-canonical-address');
      for(const element of [container,address]){
        if(!element)continue;
        element.style.setProperty('text-align','left','important');
        element.style.setProperty('justify-content','flex-start','important');
        element.style.setProperty('align-items','flex-start','important');
        element.style.setProperty('align-self','stretch','important');
        element.style.setProperty('margin-left','0','important');
        element.style.setProperty('margin-right','0','important');
        element.style.setProperty('width','100%','important');
      }
    };

    /* JOY2_HERO_ADDRESS_GRID_FIX_V79: fix the real address node after catalog styles have been copied. */
    function alignHeroAddress(card){
      const address=card.querySelector('.jj-property-address');
      if(!address)return;
      const wrapper=address.closest('.jj-canonical-address');
      const nodes=wrapper&&card.contains(wrapper)?[wrapper,address]:[address];
      for(const element of nodes){
        const overrides={
          'text-align':'left',
          'justify-self':'stretch',
          'align-self':'stretch',
          'justify-content':'flex-start',
          'align-items':'flex-start',
          'margin-left':'0',
          'margin-right':'0',
          'margin-inline-start':'0',
          'margin-inline-end':'0',
          'padding-left':'0',
          'padding-right':'0',
          'padding-inline-start':'0',
          'padding-inline-end':'0',
          'text-indent':'0',
          'width':'100%',
          'max-width':'100%',
          'min-width':'0',
          'box-sizing':'border-box',
          'direction':'ltr'
        };
        for(const [name,value] of Object.entries(overrides)){
          element.style.setProperty(name,value,'important');
        }
        element.style.setProperty('grid-column','1 / -1','important');
      }
      address.style.setProperty('display','block','important');
      address.style.setProperty('white-space','normal','important');
      address.style.setProperty('overflow-wrap','break-word','important');
      address.style.setProperty('transform','none','important');
      address.style.setProperty('translate','none','important');
    }
    /* JOY2_V230_FIT_CLONE */
    function joy2FitClone(card){
      for(const el of [card,card.querySelector('.jj-property-card-image'),card.querySelector('.jj-property-card-main')]){
        if(!el)continue;
        for(const p of ['width','min-width','max-width'])el.style.removeProperty(p);
      }
    }
    /* JOY2_V231_FIT_CLONE */
    function joy2FluidCard(card){
      for(const el of [card,card.querySelector('.jj-property-card-image'),card.querySelector('.jj-property-card-main')]){
        if(!el)continue;for(const name of ['width','min-width','max-width'])el.style.removeProperty(name);
      }
    }
    const slides=[];
    originals.forEach((original,i)=>{
      const slide=document.createElement('div');slide.className='jj-hero-slide-v6';slide.hidden=i!==0;
      const clone=original.cloneNode(true);
      if(mobileMedia.matches)deferMobileImages(clone);
      copyOriginalAppearance(original,clone);
      joy2FitClone(clone);
      alignHeroAddress(clone);
      joy2FluidCard(clone);
      clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
      clone.querySelectorAll('img').forEach(img=>{img.loading=matchMedia('(max-width:900px)').matches&&i!==0?'lazy':'eager';img.decoding='async';});
      // The cloned card is otherwise untouched; all content and badges come from the catalog.
      slide.appendChild(clone);viewport.appendChild(slide);slides.push(slide);
    });
    if(!mobileMedia.matches){
      let tallest=0;
      originals.forEach(el=>{const h=el.getBoundingClientRect().height;if(h>tallest)tallest=h;});
      viewport.style.height=Math.ceil(Math.max(tallest,380))+'px';
    }
    if(!slides.length)return;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* JOY2_HERO_CARD_DATA_SYNC_V75 */
    // Always derive the hero data from the currently rendered catalog card.
    // Other catalog scripts update price, labels and finance after DOMContentLoaded.
    function syncSlide(i){
      if(mobileMedia.matches)return; // JOY2_V249: mobile clones are permanent.
      const source=originals[i];
      const slide=slides[i];
      if(!source||!slide||!source.isConnected)return;
      const fresh=source.cloneNode(true);
      copyOriginalAppearance(source,fresh);
      joy2FitClone(fresh);
      alignHeroAddress(fresh);
      joy2FluidCard(fresh);
      fresh.removeAttribute('id');
      fresh.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
      fresh.querySelectorAll('img').forEach(img=>{img.loading=matchMedia('(max-width:900px)').matches&&i!==0?'lazy':'eager';img.decoding='async'});
      slide.replaceChildren(fresh);
    }
    slides.forEach((_,i)=>syncSlide(i));
    let current=0,busy=false,timer,animationTimer;
    function next(){
      if(busy||document.hidden||mobileMedia.matches)return;
      const old=slides[current],ni=(current+1)%slides.length,upcoming=slides[ni];
      syncSlide(ni);
      /* JOY2_V248_MOBILE_CAROUSEL */ if(reduce||matchMedia('(max-width:900px)').matches){old.hidden=true;old.classList.remove('joy2-out-v6','joy2-in-v6','joy2-pre-v6');upcoming.classList.remove('joy2-out-v6','joy2-in-v6','joy2-pre-v6');upcoming.querySelectorAll('img').forEach(x=>x.loading='eager');upcoming.hidden=false;current=ni;return;}
      busy=true;upcoming.hidden=false;upcoming.classList.add('joy2-pre-v6');void upcoming.offsetWidth;
      old.classList.add('joy2-out-v6');upcoming.classList.remove('joy2-pre-v6');upcoming.classList.add('joy2-in-v6');
      animationTimer=setTimeout(()=>{old.hidden=true;old.classList.remove('joy2-out-v6');upcoming.classList.remove('joy2-in-v6');current=ni;busy=false;animationTimer=undefined;},760);
    }
    function pause(){clearInterval(timer);timer=undefined;}
    function play(){pause();if(mobileMedia.matches||slides.length<2)return;timer=setInterval(next,4000);}
    stage.addEventListener('mouseenter',pause);stage.addEventListener('mouseleave',play);
    stage.addEventListener('focusin',pause);
    stage.addEventListener('focusout',()=>{if(!stage.contains(document.activeElement))play();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else play();});
    const mobile=mobileController({hero,stage,viewport,slides,getCurrent:()=>current,setCurrent:value=>{current=value;}});
    function changeMode(){if(mobileMedia.matches){pause();if(animationTimer){clearTimeout(animationTimer);animationTimer=undefined;busy=false;}mobile.enter();}else{mobile.leave();play();}}
    mobileMedia.addEventListener('change',changeMode);changeMode();
  }
  const scheduleInit=()=>mobileMedia.matches?requestAnimationFrame(init):requestAnimationFrame(()=>requestAnimationFrame(init));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleInit,{once:true});
  else scheduleInit();
})();

/* JOY2_FAST_HERO_SEPARATED_FILTERS_V87: hero startup delay reduced 2 time(s); no filter dependency. */

/* JOY2_HERO_FAST_AREA_SPACING_V88: first card is initialized on DOMContentLoaded without extra startup pause; changed 2 startup timer(s). */
