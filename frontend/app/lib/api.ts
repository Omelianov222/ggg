const API_URL = process.env.NEXT_PUBLIC_API_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAPI(path: string, locale: string): Promise<any> {
   if (!API_URL) {
      return new Error("API_URL is not defined");
   }

   const url = `${API_URL}${path}${path.includes("?") ? "&" : "?"}locale=${locale}${/populate/.test(path) ? "" : "&populate=*"}`;

   console.log("Built API URL:", url);
   let res: Response;
   try {
      // force-cache: Next.js/Vercel Data Cache кешує відповідь на основі Cache-Control від Strapi.
      // Non-2xx відповіді (503 cold start тощо) не кешуються — наступний запит піде до Strapi знову.
      res = await fetch(url, { cache: 'force-cache' });
      console.log("Fetching URL:", url, "Status:", res.status);
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




export async function getSectionBackgrounds(locale: string) {
   const data = await fetchAPI(
      '/api/section-backgrounds?populate[Background][fields][0]=url',
      locale
   );
   console.log("Section Backgrounds API Response:", data);
   return mapSectionNameToUrl(data as ApiResponse);
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
