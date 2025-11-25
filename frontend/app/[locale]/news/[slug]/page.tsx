import { fetchAPI } from "@/app/lib/api";

export default async function NewsItemPage({
   params
}: {
   params: { locale: string; slug: string };
}) {
   const res = await fetchAPI(`/api/news?filters[slug][$eq]=${params.slug}`, params.locale);

   if (!res.data || res.data.length === 0) {
      return <div>Not found</div>;
   }

   const item = res.data[0].attributes;

   return (
      <article>
         <h1>{item.title}</h1>
         <div>{item.content}</div>
      </article>
   );
}
