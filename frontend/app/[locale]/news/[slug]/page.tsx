import styles from '@/components/NewsItem.module.css';
import { fetchAPI } from "@/app/lib/api";
import ReactMarkdown from "react-markdown";
import Image from 'next/image';

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
      return <div className={styles.notFound}>Матеріал не знайдено</div>;
   }

   const item = res.data[0];


   return (
      <div className={styles.container}>
         <header className={styles.header}>
            <h1 className={styles.title}>{item.Title}</h1>
         </header>

         {item.Cover?.url && (
            <div className={styles.coverWrapper}>
               <Image
                  src={item.Cover.url}
                  alt={item.Cover.alternativeText || "cover"}
                  className={styles.cover}
                  width={800}
                  height={400}
               />
            </div>
         )}

         <div className={styles.content}>
            <ReactMarkdown>{item.Paragraph}</ReactMarkdown>
         </div>
      </div>
   );
}

