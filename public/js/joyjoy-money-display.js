/* JOY2_WHOLE_DOLLARS_V41 — display-only; never change model inputs. */
(function(){
  'use strict';
  // Numeric formats $1,234.56 and 1 234,56 $; not fractional millions/thousands.
  const prefix=/\$\s*((?:\d{1,3}(?:[ ,\u00a0\u202f]\d{3})+|\d+))([.,]\d{1,2})(?!\d)/g;
  const suffix=/((?:\d{1,3}(?:[ \u00a0\u202f]\d{3})+|\d+))([.,]\d{1,2})\s*\$/g;
  const skip='script,style,textarea,select,option,code,pre,input,[contenteditable],[data-editable]';
  const locale=document.documentElement.lang==='en'?'en-US':'ru-RU';
  const format=(whole,decimal)=>{
    const number=Number(whole.replace(/[ ,\u00a0\u202f]/g,'')+'.'+decimal.slice(1));
    return Number.isFinite(number)?Math.round(number).toLocaleString(locale,{maximumFractionDigits:0}):whole+decimal;
  };
  function normalize(value){
    let result=value.replace(prefix,(match,whole,decimal,offset,source)=>{
      // Never round a scaled KPI such as $7,52 млн to $8 млн.
      if(/^\s*(?:млн|тыс|mln|million|thousand|ming|m|k)(?=\s|$|[.,;:)])/i.test(source.slice(offset+match.length)))return match;
      return '$'+format(whole,decimal);
    });
    result=result.replace(suffix,(match,whole,decimal,offset,text)=>{
      // E.g. "0,25 млн $" is millions, not cents. Do not alter scaled quantities.
      if(/(?:млн|тыс|million|thousand|mln|ming)\s*$/i.test(text.slice(0,offset).split(/\s+/).slice(-2).join(' ')))return match;
      return format(whole,decimal)+' $';
    });
    return result;
  }
  function visit(node){
    if(node.nodeType===3){
      if(!node.parentElement||node.parentElement.closest(skip))return;
      const before=node.nodeValue||'';
      if(!before.includes('$'))return;
      const after=normalize(before);
      if(after!==before)node.nodeValue=after;
      return;
    }
    if(node.nodeType!==1||node.matches(skip))return;
    const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const n of nodes)visit(n);
  }
  function start(){
    if(!document.body)return;
    visit(document.body);
    const watcher=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='characterData')visit(record.target);
        else for(const node of record.addedNodes)visit(node);
      }
    });
    watcher.observe(document.body,{subtree:true,childList:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
