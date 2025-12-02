import { fetchAPI } from "@/app/lib/api";

export default async function NewsItemPage({
   params,
}: {
   params: Promise<{ locale: string; slug: string }>;
}) {
   const resolvedParams = await params; // розпаковуємо проміс

   console.log(resolvedParams);
   const res = await fetchAPI(`/api/news?filters[Slug][$eq]=${resolvedParams.slug}`,
      resolvedParams.locale
   );
   console.log("item1111", res);


   if (!res.data || res.data.length === 0) {
      return <div>Not found</div>;
   }

   const item = res.data[0];

   return (
      <article>
         <h1>{item.Title}</h1>
         {renderRichText(item.Content)}
      </article>
   );
}
function renderRichText(blocks: any[]): React.ReactNode {
   return blocks.map((block, i) => {
      if (block.type === "paragraph") {
         return (
            <p key={i}>
               {block.children.map((child: any, j: number) => child.text)}
            </p>
         );
      }
      return null;
   });
}
