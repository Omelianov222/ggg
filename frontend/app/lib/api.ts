const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(path: string, locale: string) {
   if (!API_URL) {
      return new Error("API_URL is not defined");
   }

   const url = `${API_URL}${path}${path.includes("?") ? "&" : "?"}locale=${locale}&populate=*`;

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
