import styles from '@/components/NewsItem.module.css';
import { fetchAPI } from "@/app/lib/api";
import ReactMarkdown from "react-markdown";

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
   const markdown = convertStrapiBlocksToMarkdown(item.Content);

   return (
      <div className={styles.container}>
         <header className={styles.header}>
            <h1 className={styles.title}>{item.Title}</h1>
         </header>

         {item.Cover?.url && (
            <div className={styles.coverWrapper}>
               <img
                  src={item.Cover.url}
                  alt={item.Cover.alternativeText || "cover"}
                  className={styles.cover}
               />
            </div>
         )}

         <div className={styles.content}>
            <ReactMarkdown>{markdown}</ReactMarkdown>
         </div>
      </div>
   );
}

/* --------------------------- */
/*  Конвертація Strapi → Markdown */
/* --------------------------- */

function convertStrapiBlocksToMarkdown(blocks: any[]): string {
   return blocks
      .map(block => {
         if (block.type === "paragraph") {
            const text = joinChildren(block.children);
            return text.trim() === "" ? "" : text + "\n\n";
         }

         if (block.type === "heading") {
            const text = joinChildren(block.children);
            const prefix = "#".repeat(block.level);
            return `${prefix} ${text}\n\n`;
         }

         if (block.type === "list") {
            return block.children
               .map((li: any, i: number) => {
                  const t = joinChildren(li.children);
                  return block.format === "ordered"
                     ? `${i + 1}. ${t}`
                     : `- ${t}`;
               })
               .join("\n") + "\n\n";
         }

         return "";
      })
      .join("");
}

function joinChildren(children: any[]): string {
   return children
      .map(child => {
         if (child.type !== "text") return "";

         let txt = child.text || "";

         if (child.bold) txt = `**${txt}**`;
         if (child.italic) txt = `*${txt}*`;

         return txt;
      })
      .join("");
}
