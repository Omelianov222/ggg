const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(path: string, locale: string) {
   console.log(API_URL)
   const url = `${API_URL}${path}${path.includes('?') ? '&' : '?'}locale=${locale}&populate=*`;

   const res = await fetch(url, {
      cache: 'no-store'
   });
   console.log(res)
   if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
   }

   return res.json();
}
