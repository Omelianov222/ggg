import { fetchAPI } from "@/app/lib/api";
import HomeHero from "@/components/HomeHero";
export const revalidate = 3600; // ISR: 60 minutes

export default async function HomePage({ params }: { params: { locale: string } }) {
   const { locale } = await params;
   const data = await fetchAPI("/api/home", locale);
   return <HomeHero data={data.data} locale={locale} />;
}
