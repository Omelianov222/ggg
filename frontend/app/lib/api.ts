// lib/api.ts
import { unstable_cache } from 'next/cache';

const API_URL = process.env.API_URL;

export const REVALIDATE = 86400; // 1 day (seconds)

function buildUrl(path: string, locale: string): string {
   return `${API_URL}${path}${path.includes("?") ? "&" : "?"}locale=${locale}${/populate/.test(path) ? "" : "&populate=*"}`;
}

/**
 * Internal fetcher wrapped in unstable_cache.
 * ONLY successful responses are cached — any throw (network error, non-2xx,
 * invalid JSON) is NOT stored in cache, so the next request retries fresh.
 */
const _fetchAndParse = unstable_cache(
   async (url: string) => {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return res.json() as Promise<any>; // throws on invalid JSON
   },
   ['api-fetch'],
   { revalidate: REVALIDATE }
);

export async function fetchAPI(path: string, locale: string) {
   if (!API_URL) {
      return new Error("API_URL is not defined");
   }

   const url = buildUrl(path, locale);

   try {
      return await _fetchAndParse(url);
   } catch (err) {
      console.error("API error", { path, error: String(err) });
      return err instanceof Error ? err : new Error("API request failed");
   }
}

// ─── Centralized typed fetchers ────────────────────────────────────────────

export type NavItem = { label: string; link: string };

interface NavLocalization { locale: string; Label: string; Link: string }
interface NavResponseItem { locale: string; Label: string; Link: string; localizations?: NavLocalization[] }

export async function fetchNavItems(locale: string): Promise<NavItem[]> {
   const res = await fetchAPI('/api/navbars', locale);
   if (res instanceof Error) return [];
   return ((res?.data ?? []) as NavResponseItem[]).map((item) => {
      if (item.locale === locale) return { label: item.Label, link: item.Link };
      const loc = item.localizations?.find((l) => l.locale === locale);
      return loc ? { label: loc.Label, link: loc.Link } : { label: item.Label, link: item.Link };
   });
}

export type SocialItem = { id: number; link: string; SocialName: string };

export async function fetchSocials(locale: string): Promise<SocialItem[]> {
   const res = await fetchAPI('/api/socials', locale);
   if (res instanceof Error) return [];
   return (res?.data ?? []) as SocialItem[];
}

export type BrandItem = {
   id?: number;
   BrandLabel?: string;
   Brand?: { url?: string; formats?: { large?: { url?: string } } };
};

export async function fetchBrands(locale: string): Promise<BrandItem[]> {
   const res = await fetchAPI('/api/main-page-brands', locale);
   if (res instanceof Error) return [];
   return (res?.data ?? []) as BrandItem[];
}

export async function fetchHome(locale: string) {
   const res = await fetchAPI('/api/home', locale);
   if (res instanceof Error) return null;
   return res?.data ?? null;
}

export async function fetchAboutUsContent(locale: string) {
   const res = await fetchAPI('/api/about-us-content', locale);
   if (res instanceof Error) return null;
   return res?.data ?? null;
}

export async function fetchAboutUsSections(locale: string) {
   const res = await fetchAPI('/api/about-us-sections?fields[0]=Paragraph&populate[Photo][fields][0]=url', locale);
   if (res instanceof Error) return null;
   return res?.data ?? null;
}

export async function fetchGalleries(locale: string) {
   const res = await fetchAPI('/api/galleries', locale);
   if (res instanceof Error) return null;
   return res?.data ?? null;
}

export async function fetchNews(locale: string) {
   const res = await fetchAPI('/api/news', locale);
   if (res instanceof Error) return null;
   return res?.data ?? null;
}

export async function fetchNewsItem(slug: string, locale: string) {
   const res = await fetchAPI(`/api/news?filters[Slug][$eq]=${slug}`, locale);
   if (res instanceof Error) return null;
   return (res?.data ?? [])[0] ?? null;
}



export async function getSectionBackgrounds(locale: string) {
   const data = await fetchAPI(
      '/api/section-backgrounds?populate[Background][fields][0]=url',
      locale
   );
   // console.log("Section Backgrounds API Response:", data);
   return mapSectionNameToUrl(data);
}

type BackgroundItem = {
   url?: string;
};

type SectionItem = {
   SectionName?: string;
   Background?: BackgroundItem[];
};

type ApiResponse = {
   data?: SectionItem[];
};

export function mapSectionNameToUrl(input: ApiResponse): Record<string, string> {
   if (!input.data) return {};

   return input.data.reduce<Record<string, string>>((acc, item) => {
      const sectionName = item.SectionName;
      const url = item.Background?.[0]?.url;

      if (sectionName && url) {
         acc[sectionName] = url;
      }

      return acc;
   }, {});
}
