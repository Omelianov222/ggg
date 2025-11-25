import { fetchAPI } from "@/app/lib/api";
import NewsList from "@/components/NewsList";

export default async function NewsPage({ params }: { params: { locale: string } }) {
   const data = await fetchAPI("/api/news", params.locale);

   return <NewsList items={data.data} />;
}
