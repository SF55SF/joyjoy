/* JOY2_BP_OFFER_V29; DOM-only enhancement; no investment calculations. */
(()=>{
 const slug='the-business-park-block-3';
 const text=()=>document.documentElement.lang==='en'?'Investment offering':document.documentElement.lang==='uz'?'Investitsiya taklifi':'Инвестиционное предложение';
 const badge=(kind)=>{const s=document.createElement('span');s.className='jj-bp-offer-badge jj-bp-offer-'+kind;s.textContent=text();return s;};
 function catalog(){
  document.querySelectorAll('[data-slug="'+slug+'"] .jj-property-card-image').forEach(el=>{if(!el.querySelector('.jj-bp-offer-badge'))el.append(badge('badge-card'));});
 }
 function detail(){
  if(!decodeURIComponent(location.pathname).includes('/listing/'+slug+'/'))return;
  const main=document.querySelector('.jj-detail-main');if(!main)return;
  const snapshot=document.querySelector('.jj-bizpark-snapshot');
  const sections=Array.from(main.children).filter(el=>el.tagName==='SECTION');
  const info=sections.filter(s=>{const h=s.querySelector('h2');return h&&/^(Описание объекта|Описание|Description|Tavsif|Характеристики|Features|Xususiyatlar)$/i.test(h.textContent.trim());});
  const table=Array.from(main.querySelectorAll('table')).find(t=>t.closest('[class*="unit"]')||t.querySelector('[class*="unit"]'))||main.querySelector('table');
  const unitRoot=main.querySelector('.jj-units, [data-jj-units], [data-units], .jj-units-section, .jj-units-table')||table?.closest('section')||main;
  if(!snapshot&&!info.length)return;
  if(!document.querySelector('.jj-bp-offer-inline')){
   const title=document.querySelector('.jj-detail-heading h1');if(title)title.after(badge('inline'));
  }
  const wrap=document.createElement('details');wrap.className='jj-bp-commercial';
  const title=document.createElement('summary');title.textContent=(document.documentElement.lang==='en'?'Commercial terms':document.documentElement.lang==='uz'?'Tijorat shartlari':'Коммерческие условия')+' · '+text();wrap.append(title);
  const body=document.createElement('div');body.className='jj-bp-commercial-body';wrap.append(body);
  for(const el of [...info,...(snapshot?[snapshot]:[])])body.append(el);
  // Table: place drawer immediately beneath first unit row. Other layouts: place after unit list.
  let row=null;
  if(table){const tb=table.tBodies&&table.tBodies[0];row=tb?.querySelector('tr')||null;}
  if(row){
    const extra=document.createElement('tr');extra.className='jj-bp-extra-row';
    const cell=document.createElement('td');cell.colSpan=Math.max(1,row.children.length);cell.append(wrap);extra.append(cell);row.after(extra);
    const flag=badge('inline');const cellTarget=row.lastElementChild;if(cellTarget)cellTarget.append(flag);
    row.classList.add('jj-bp-openable');row.tabIndex=0;row.setAttribute('aria-expanded','false');
    function toggle(){wrap.open=!wrap.open;row.setAttribute('aria-expanded',String(wrap.open));}
    row.addEventListener('click',e=>{if(e.target.closest('a,button,input,select,summary'))return;toggle();});
    row.addEventListener('keydown',e=>{if(e.target!==row)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
    wrap.addEventListener('toggle',()=>row.setAttribute('aria-expanded',String(wrap.open)));
  } else {
    // Never discard content if the unit layout differs.
    if(unitRoot!==main)unitRoot.after(wrap);else main.prepend(wrap);
  }
 }
 function ready(){catalog();detail();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
