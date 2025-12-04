import Link from "next/link";
import styles from "./NewsList.module.css";
import Image from "next/image";



export default function NewsList({
   items,
   locale,
}: {
   items: any[];
   locale: string;
}) {
   console.log("items", JSON.stringify(items));
   return (
      <div className={styles.newsGrid}>
         {items.map((item) => (
            <article key={item.id} className={styles.newsCard}>
               {/* Лінки ведуть на [slug]/page.tsx */}
               <Link href={`/${locale}/news/${item.Slug}`}>
                  <h2>{item.Title}</h2>
               </Link>
               <Link href={`/${locale}/news/${item.Slug}`}>
                  <Image
                     src={item.Cover?.url || ""}
                     alt={item.Cover?.alternativeText || ""}
                     width={500}
                     height={500}
                  />
               </Link>

            </article>
         ))}
      </div>
   );
}
