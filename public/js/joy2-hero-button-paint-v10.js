/* JOY2 HERO BUTTON COLOR ENFORCER V10: styles only, does not build cards. */
(()=>{
 const paint=()=>{
   const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
   if(!hero)return;
   const links=[...hero.querySelectorAll('.jj-ref-actions > a.jj-ref-cta')];
   const investment=links.find(a=>(a.getAttribute('href')||'').includes('investment=1'));
   const all=links.find(a=>(a.getAttribute('href')||'')==='#catalog');
   function apply(link,bg,fg,arrow){
     if(!link)return;
     link.style.setProperty('background',bg,'important');
     link.style.setProperty('background-image',bg,'important');
     link.style.setProperty('color',fg,'important');
     for(const label of link.querySelectorAll('.joy2-hero-cta-label')) label.style.setProperty('color',fg,'important');
     for(const svg of link.querySelectorAll('.joy2-cta-real-arrow')){
       svg.style.setProperty('color',arrow,'important');
       svg.style.setProperty('stroke',arrow,'important');
       for(const path of svg.querySelectorAll('path'))path.style.setProperty('stroke',arrow,'important');
     }
   }
   apply(all,'linear-gradient(#292929,#111)','#ffffff','#ffffff');
   apply(investment,'linear-gradient(#ffffff,#f9f9fb)','#101112','#b8ff28');
   const stage=hero.querySelector('.jj-hero-right-v2.jj-hero-stage-v6');
   if(stage){
     for(const prop of ['background','background-image','border','box-shadow','backdrop-filter','-webkit-backdrop-filter'])stage.style.setProperty(prop,prop==='background'||prop==='background-image'?'none':prop==='border'?'0':'none','important');
     stage.style.setProperty('padding','0','important');
     stage.style.setProperty('overflow','visible','important');
     for(const frame of stage.querySelectorAll('.jj-hero-rotator-v6'))frame.style.setProperty('overflow','visible','important');
     for(const card of stage.querySelectorAll('.jj-hero-slide-v6 > .jj-property-card'))card.style.setProperty('box-shadow','0 22px 44px rgba(19,22,29,.23), 0 7px 15px rgba(19,22,29,.1)','important');
   }
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',paint,{once:true});else paint();
 window.addEventListener('load',paint,{once:true});
 setTimeout(paint,850);
})();
