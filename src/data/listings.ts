import {validateProperty,isPublishedProject} from '../../public/js/joyjoy-investment-model.js';
// Location coordinates below come from the individual CMWP property map embeds, checked 2026-11-14.
// JOYJOY_CMWP_IMPORT_V1 — проверенные карточки из раздела «Продажа» cmwp.uz, 14.11.2026.
// Предложения и цены могут меняться. Обновлять по источнику перед публикацией.
export type PropertyType = 'office' | 'retail' | 'warehouse' | 'land';
export type PropertyStatus = 'existing' | 'under_construction' | null;
export interface Listing {
 published?: boolean; showCatalog?: boolean; showProjects?: boolean; order?: number;
 translations?: Partial<Record<'uz'|'en',Partial<Pick<Listing,'title'|'city'|'district'|'address'|'description'|'features'>>>>;
 investment?: Record<string,any> | null;

 slug: string; title: string; city: string; district: string; address: string;
 type: PropertyType; status: PropertyStatus; area: number; priceUsd: number | null;
 images: string[]; description: string; features: string[]; sourceUrl?: string;
 capRate?: number; lat?: number; lng?: number;
}
// JOYJOY_PROPERTY_COLLECTION_V1
// JOYJOY_MIGRATED_SLUGS: ["ea-insurance","tashkent-furniture-factory","daho-block-e","nur","floor-sale-at-trilliant-business-center","center-one-4th-office-floor","building-on-koratosh-massif","cambridge-residence","building-on-ipak-yoli","sarbon-business-center","bukhara"]
const files = import.meta.glob('../content/properties/*.json', {eager:true,import:'default'});
export const allListings: Listing[] = Object.entries(files).map(([path,value])=>{
 const item=value as Listing;
 const errors=validateProperty(item);
 if(errors.length||!path.endsWith('/'+item.slug+'.json'))throw new Error('Invalid property '+path+': '+errors.join(', '));
 return item;
}).sort((a,b)=>(a.order??0)-(b.order??0)||a.slug.localeCompare(b.slug));
if(new Set(allListings.map(x=>x.slug)).size!==allListings.length)throw new Error('Duplicate property slug');
export const listings: Listing[] = allListings.filter(item=>item.published!==false&&(item.showCatalog!==false||isPublishedProject(item)));
export function getListing(slug: string): Listing | undefined {
  return listings.find((item) => item.slug === slug);
}
