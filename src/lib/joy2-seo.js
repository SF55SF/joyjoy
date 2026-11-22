// JOY2_V244_STAGE2: read-only JSON-LD for individual property pages.
const base='https://joyjoy.uz';
const absolute=(s)=>{if(typeof s!=='string'||!s.trim())return null;try{const u=new URL(s,base);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}};
const text=(s)=>String(s??'').trim();
export function propertySeo(listing,lang='ru'){
  const slug=text(listing.slug);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error('Invalid property slug');
  const prefix=lang==='en'?'/en':lang==='uz'?'/uz':'';
  const url=base+prefix+'/listing/'+slug+'/';
  const image=Array.isArray(listing.images)?listing.images.map(absolute).find(Boolean):null;
  const location=[text(listing.district),text(listing.city), 'Uzbekistan'].filter(Boolean).join(', ');
  const place={ '@type':'Place',name:text(listing.title),address:{'@type':'PostalAddress',streetAddress:text(listing.address),addressLocality:text(listing.city),addressRegion:text(listing.district)||undefined,addressCountry:'UZ'},...((Number.isFinite(Number(listing.lat))&&Number.isFinite(Number(listing.lng))&&listing.lat!=null&&listing.lng!=null)?{geo:{'@type':'GeoCoordinates',latitude:Number(listing.lat),longitude:Number(listing.lng)}}:{})};
  const page={'@type':'WebPage','@id':url+'#webpage',url,name:text(listing.title)+' — Joy²',description:text(listing.description),inLanguage:lang,about:place,isPartOf:{'@id':base+'/#website'},...(image?{primaryImageOfPage:image}:{})};
  const amount=listing.priceUsd;
  if(typeof amount==='number'&&Number.isFinite(amount)&&amount>0){page.mainEntity={'@type':'Offer',url,priceCurrency:'USD',price:amount,itemOffered:place};}
  return {image,structuredData:page,location};
}
