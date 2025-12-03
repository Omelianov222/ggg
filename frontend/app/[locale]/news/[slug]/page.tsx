
import { fetchAPI } from "@/app/lib/api";

export default async function NewsItemPage({
   params,
}: {
   params: Promise<{ locale: string; slug: string }>;
}) {
   const resolvedParams = await params;

   const res = await fetchAPI(
      `/api/news?filters[Slug][$eq]=${resolvedParams.slug}`,
      resolvedParams.locale
   );

   if (!res.data || res.data.length === 0) {
      return <div className="text-center text-xl font-semibold mt-10">Матеріал не знайдено</div>;
   }

   const item = res.data[0];

   return (
      <>
         <h1 className="text-4xl font-bold mb-4 text-center">{item.Title}</h1>

         {
            item.Cover?.url && (
               <img
                  src={item.Cover.url}
                  alt={item.Cover.alternativeText || "cover"}
                  className="w-full rounded-xl mb-8 border border-gray-200"
               />
            )
         }

         <div className="rounded-2xl border border-gray-200 shadow p-6 prose prose-lg max-w-none">
            {renderRichText(item.Content)}
         </div>
      </>


   );
}

function renderRichText(blocks: any[]): React.ReactNode {
   return blocks.map((block, i) => {
      if (block.type === "paragraph") {
         return <p key={i}>{block.children.map((child: any, j: number) => child.text)}</p>;
      }
      return null;
   });
}
