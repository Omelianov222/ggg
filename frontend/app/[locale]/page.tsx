import { fetchAPI, fetchBrands } from "@/app/lib/api";
import HomeHero from "@/components/HomeHero";
export const revalidate = 86400; // 1 day

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function resolveUrl(path?: string) {
   if (!path) return undefined;
   if (path.startsWith("http")) return path;
   return API_URL.replace(/\/$/, "") + path;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;

   const [homeData, brandsData] = await Promise.all([
      fetchAPI("/api/home", locale),
      fetchBrands(locale),
   ]);

   const brands = brandsData
      .map((b) => ({
         title: b.BrandLabel ?? "",
         image: resolveUrl(b?.Brand?.url),
      }))
      .sort((a, b) => {
         if (a.title === "Video") return -1;
         if (b.title === "Video") return 1;
         return 0;
      })
      .slice(0, 6);

   return <HomeHero data={homeData?.data} locale={locale} brands={brands} />;
}
