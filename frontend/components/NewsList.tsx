import Link from "next/link";
import styles from "./NewsList.module.css";

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

export default function NewsList({
   items,
   locale,
}: {
   items: any[];
   locale: string;
}) {
   console.log("items", items);
   return (
      <div className={styles.newsGrid}>
         {items.map((item) => (
            <article key={item.id} className={styles.newsCard}>
               {/* Лінки ведуть на [slug]/page.tsx */}
               <Link href={`/${locale}/news/${item.Slug}`}>
                  <h2>{item.Title}</h2>
               </Link>
               <Link href={`/${locale}/news/${item.Slug}`}>
                  <img
                     src={item.Cover?.url || ""}
                     alt={item.Cover?.alternativeText || ""}
                  />
               </Link>
               {renderRichText(item.Content)}
            </article>
         ))}
      </div>
   );
}
