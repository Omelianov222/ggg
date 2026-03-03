import { fetchAPI } from "@/app/lib/api";
import FamilyBrand from "@/components/FamilyBrand";
import NewsList from "@/components/NewsList";
export const revalidate = 3600; // ISR: 60 minutes

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
   const resolvedParams = await params; // розпаковуємо проміс
   const data = await fetchAPI("/api/news", resolvedParams.locale);

   console.log("resolvedParams", resolvedParams);

   return (
      <>

         <NewsList items={data.data} locale={resolvedParams.locale} />
         <div style={{ background: "#fff", color: "var(--family-text)", padding: "2rem 0 0 0" }}>
            <p style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}> Lorem ipsum dolor sit amet consectetur adipisicing elit. Error accusantium iure tenetur, corporis officia adipisci voluptatibus ullam architecto voluptas illum quasi quia asperiores rerum provident ea mollitia a molestias numquam?</p>
         </div>
         <FamilyBrand />
      </>

   )

}
