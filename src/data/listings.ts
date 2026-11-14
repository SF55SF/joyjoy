// JOYJOY_MARKETPLACE_DATA_V1
// Only verified property data belongs here. Add real listings to this array.
export type PropertyType = 'office' | 'retail' | 'warehouse' | 'land' | 'other';
export type PropertyStatus = 'available' | 'reserved' | 'sold';
export interface Listing {
  slug: string;
  title: string;
  city: string;
  district: string;
  address: string;
  type: PropertyType;
  status: PropertyStatus;
  area: number;
  priceUsd: number | null;
  images: string[];
  description: string;
  features: string[];
  // Optional verified investment metrics and map coordinates
  capRate?: number;
  lat?: number;
  lng?: number;
}
export const listings: Listing[] = [];
export function getListing(slug: string): Listing | undefined {
  return listings.find((item) => item.slug === slug);
}

