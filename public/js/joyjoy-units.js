// JOY2_INLINE_ROW_INVESTMENT_V3
for(const root of document.querySelectorAll('[data-jj-units]')){
 const rows=Array.from(root.querySelectorAll('[data-jj-unit-select]'));
 const panels=Array.from(root.querySelectorAll('[data-jj-unit-panel]'));
 root.addEventListener('click',event=>{
  const close=event.target.closest('[data-jj-finance-close]');
  if(close){const p=close.closest('[data-jj-unit-panel]');if(p)p.hidden=true;for(const b of rows){b.setAttribute('aria-expanded','false');b.setAttribute('aria-pressed','false');b.classList.remove('is-active');}return;}
  const b=event.target.closest('[data-jj-unit-select]');if(!b||!root.contains(b))return; /* JOY2_V28_NON_INVEST_CLICK_GUARD */ if(root.dataset.jjInvestProject!=="yes"||!b.querySelector(".jj-unit-finance-flag"))return;
  const id=b.dataset.jjUnitSelect,p=panels.find(x=>x.dataset.jjUnitPanel===id);
  if(!p)return;const shouldOpen=p.hidden;
  for(const x of panels)x.hidden=true;
  for(const x of rows){x.setAttribute('aria-pressed','false');x.setAttribute('aria-expanded','false');x.classList.remove('is-active');}
  p.hidden=!shouldOpen;if(shouldOpen){b.setAttribute('aria-pressed','true');b.setAttribute('aria-expanded','true');b.classList.add('is-active');}
 });
}
