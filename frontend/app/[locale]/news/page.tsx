import { fetchAPI } from "@/app/lib/api";
import FamilyBrand from "@/components/FamilyBrand";
import NewsList from "@/components/NewsList";

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
   const resolvedParams = await params; // розпаковуємо проміс
   const data = await fetchAPI("/api/news", resolvedParams.locale);

   console.log("resolvedParams", resolvedParams);

   return (
      <>
         <NewsList items={data.data} locale={resolvedParams.locale} />;
         <FamilyBrand />
      </>

   )

}
