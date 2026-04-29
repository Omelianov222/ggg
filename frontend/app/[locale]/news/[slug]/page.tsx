import styles from '@/components/NewsItem.module.css';
import { fetchAPI } from "@/app/lib/api";
import ReactMarkdown from "react-markdown";
import Image from 'next/image';
import { PageHeader } from '@/components/UI/PageHeader';

export async function generateStaticParams() {
   const locales = ['en', 'pl'];
   const params: { locale: string; slug: string }[] = [];
   for (const locale of locales) {
      const data = await fetchAPI('/api/news', locale);
      if (data?.data) {
         for (const item of data.data) {
            if (item.Slug) params.push({ locale, slug: item.Slug });
         }
      }
   }
   return params;
}

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
         <PageHeader title={item.Title} />


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

