"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./NewsList.module.css";
import Image from "next/image";
import { PageHeader } from "./UI/PageHeader";

function getAverageColor(src: string): Promise<string | null> {
   return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = document.createElement("img") as HTMLImageElement;
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => {
         try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);
            const w = 30;
            const h = 30;
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data;
            let r = 0,
               g = 0,
               b = 0,
               count = 0;
            for (let i = 0; i < data.length; i += 4) {
               const alpha = data[i + 3];
               if (alpha === 0) continue;
               r += data[i];
               g += data[i + 1];
               b += data[i + 2];
               count++;
            }
            if (count === 0) return resolve(null);
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            resolve(`rgba(${r}, ${g}, ${b}, 0.38)`);
         } catch (err) {
            console.error(err);
            resolve(null);
         }
      };
      img.onerror = () => resolve(null);
   });
}

// allow explicit any for incoming CMS items here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NewsList({
   items,
   locale,
}: {
   items: any[];
   locale: string;
}) {
   const [colors, setColors] = useState<Record<string | number, string>>({});

   useEffect(() => {
      // compute colors for items client-side only
      items.forEach((item) => {
         const id = item.id;
         const src = item.Cover?.url || "";
         if (!src || colors[id]) return;
         getAverageColor(src).then((color) => {
            setColors((prev) => ({ ...prev, [id]: color || "rgba(255, 255, 255, 0.45)" }));
         });
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [items]);

   return (
      <section className={styles.newsSection}>
         <PageHeader title="Latest News" colorVar="--news-heading-h1" />
         <div className={styles.newsGrid}>
            {items.map((item) => (
               <article
                  key={item.id}
                  className={styles.newsCard}
                  ref={(el) => {
                     if (el && colors[item.id]) {
                        (el as HTMLElement).style.setProperty("--preview-color", colors[item.id]);
                     }
                  }}
               >
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
      </section>

   );
}
