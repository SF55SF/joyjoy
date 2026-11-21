/* JOY2_V201_TEXT_MINUS20: actual page typography, original DOM and financial data unchanged. */
(()=>{
  const rootSelector='main.jj-detail, header.jj-detail-sitebar';
  function shrink(){
    if(!matchMedia('(max-width:760px)').matches)return;
    const roots=[...document.querySelectorAll(rootSelector)];
    if(!roots.length)return;
    const targets=[];
    for(const root of roots){
      for(const element of [root,...root.querySelectorAll('*')]){
        if(element.dataset.joy2V201Text==='1')continue;
        if(element.matches('svg,svg *,img,style,script,option,input,textarea,select'))continue;
        if(![...element.childNodes].some(node=>node.nodeType===3 && node.textContent.trim()))continue;
        const size=parseFloat(getComputedStyle(element).fontSize);
        if(Number.isFinite(size)&&size>0)targets.push([element,size]);
      }
    }
    for(const [element,size] of targets){
      element.dataset.joy2V201Text='1';
      element.style.setProperty('font-size',(size*.8).toFixed(2)+'px','important');
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(shrink),{once:true});
  else requestAnimationFrame(shrink);
  window.addEventListener('load',shrink,{once:true});
  setTimeout(shrink,700);
})();
