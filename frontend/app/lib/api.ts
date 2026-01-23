const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(path: string, locale: string) {
   if (!API_URL) {
      return new Error("API_URL is not defined");
   }

   const url = `${API_URL}${path}${path.includes("?") ? "&" : "?"}locale=${locale}${/populate/.test(path) ? "" : "&populate=*"}`

   console.log("Built API URL:", url); // Лог лише на сервер
   let res;
   try {
      res = await fetch(url, { next: { revalidate: 60 } }) // кеш 60 секунд
      console.log("Fetching URL:", url, "Response:", res); // Лог лише на сервер
   } catch {
      // Лог лише на сервер
      console.error("Network failure when fetching", { path });
      return new Error("Failed to reach API");
   }

   if (!res.ok) {
      // Лог на сервер, без URL, без locale
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
