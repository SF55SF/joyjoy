# JoyJoy — Google Maps setup

The marketplace uses **Google Maps JavaScript API** exclusively. No API key is included in the repository.

1. In Google Cloud Console enable billing and **Maps JavaScript API**.
2. Create an API key restricted to **HTTP referrers** (your production domain and StackBlitz preview hostname) and restrict its API access to Maps JavaScript API.
3. In StackBlitz environment variables set `PUBLIC_GOOGLE_MAPS_API_KEY` to the restricted key. Restart `npm run dev` or rebuild.
4. **Recommended for grayscale cloud styling:** under Google Maps Platform → Map Styles create a *Light → Monochrome* style, publish it, create a JavaScript **Map ID**, associate this style with the Map ID, and set `PUBLIC_GOOGLE_MAPS_MAP_ID`.
5. Without a Map ID, the client uses a built-in gray JSON style for the base Google map. Do not combine these two styles; cloud style wins when the Map ID is set.
6. Set `PUBLIC_SITE_URL=https://your-confirmed-domain.example` **only when real domain is ready**. Until then JoyJoy pages remain noindex.

**Coordinates:** listings have optional `lat` and `lng`. Nothing will be pinned unless accurate coordinates are provided. Unmapped listings remain searchable in the catalog. Exact coordinates should be confirmed before publishing. Existing `src/data/listings.ts` is currently the source of records; the old Trilliant admin system is not connected to it and needs separate redevelopment before being used in production.

**Caution:** Google Maps is a billable Google service. Set budget alerts and domain/API key restrictions. Google cloud style configuration and Maps key cannot be created automatically without your Google Cloud credentials.
