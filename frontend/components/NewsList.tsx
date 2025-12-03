import Link from "next/link";
import styles from "./NewsList.module.css";



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

            </article>
         ))}
      </div>
   );
}
