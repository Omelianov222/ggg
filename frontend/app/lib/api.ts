// lib/api.ts
const API_URL = process.env.API_URL;

export const REVALIDATE = 86400; // 1 day (seconds)
// export const REVALIDATE = 0; // 1 day (seconds)

export async function fetchAPI(path: string, locale: string) {
   console.log("API_URL:", API_URL); // ← додай це
   console.log("Fetching:", `${API_URL}${path}`);
   if (!API_URL) {
      return new Error("API_URL is not defined");
   }

   const url = `${API_URL}${path}${path.includes("?") ? "&" : "?"}locale=${locale}${/populate/.test(path) ? "" : "&populate=*"}`

   let res;
   try {
      res = await fetch(url, { next: { revalidate: REVALIDATE } })
   } catch {
      console.error("Network failure when fetching", { path });
      return new Error("Failed to reach API");
   }

   if (!res.ok) {
      console.error("API returned non-OK status", { status: res.status, path });
      return new Error("API request failed");
   }

   try {
      return await res.json();
   } catch {
      console.error("Failed to parse JSON", { path });
      return new Error("Invalid API response");
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
