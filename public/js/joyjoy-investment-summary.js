// Public read-only disclosures: all inputs and calculations are prepared by Astro.
for(const root of document.querySelectorAll('[data-jj-units]'))root.addEventListener('click',event=>{
 const button=event.target.closest('[data-jj-calc-toggle]');if(!button)return;
 const id=button.dataset.jjCalcToggle,panel=Array.from(root.querySelectorAll('[data-jj-calc-content]')).find(el=>el.dataset.jjCalcContent===id);
 if(!panel)return;
 const open=panel.hidden;
 for(const other of root.querySelectorAll('[data-jj-calc-content]'))other.hidden=true;
 for(const b of root.querySelectorAll('[data-jj-calc-toggle]')){b.setAttribute('aria-expanded','false');const glyph=b.querySelector('span');if(glyph)glyph.textContent='▾';}
 panel.hidden=!open;button.setAttribute('aria-expanded',String(open));const glyph=button.querySelector('span');if(glyph)glyph.textContent=open?'▴':'▾';
 if(open&&matchMedia('(prefers-reduced-motion: reduce)').matches===false)panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});