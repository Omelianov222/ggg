import { fetchAPI } from "@/app/lib/api";
import HomeHero from "@/components/HomeHero";

export default async function HomePage({ params }: { params: { locale: string } }) {
   const { locale } = await params;  // <- розгортаємо Promise
   console.log(locale)
   const data = await fetchAPI("/api/home", locale);
   console.log(data.data.attributes)
   return <HomeHero data={data.data} />;
}
