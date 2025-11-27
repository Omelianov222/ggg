import { fetchAPI } from "@/app/lib/api";
import HomeHero from "@/components/HomeHero";

export default async function HomePage({ params }: { params: { locale: string } }) {
   const { locale } = await params;
   const data = await fetchAPI("/api/home", locale);
   return <HomeHero data={data.data} locale={locale} />;
}
