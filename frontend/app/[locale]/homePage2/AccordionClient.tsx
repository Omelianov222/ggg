"use client";
import React, { useEffect, useState } from "react";
import styles from "./AccordionClient.module.css";
import { fetchAPI } from "@/app/lib/api";

type BrandItem = {
   id?: number;
   BrandLabel?: string;
   Brand?: { url?: string; formats?: { large?: { url?: string } } };
};

function resolveUrl(path?: string) {
   if (!path) return undefined;
   if (path.startsWith("http")) return path;
   const base = process.env.NEXT_PUBLIC_API_URL ?? "";
   return base.replace(/\/$/, "") + path;
}

const DEFAULT_TITLES = [
   { title: "Творчість", desc: "Досліджуйте безмежні можливості творчого самовираження через мистецтво, музику та дизайн" },
   { title: "Інновації", desc: "Впроваджуйте нові ідеї та технології для створення майбутнього" },
   { title: "Природа", desc: "Насолоджуйтесь красою навколишнього світу та гармонією з природою" },
   { title: "Технології", desc: "Розвивайте цифрові навички та досліджуйте світ сучасних технологій" },
   { title: "Подорожі", desc: "Відкривайте нові горизонти та пізнавайте різні культури світу" },
   { title: "Наука", desc: "Досліджуйте таємниці всесвіту через призму наукових відкриттів" },
   { title: "Майбутнє", desc: "Створюйте власне майбутнє та втілюйте мрії в реальність" },
];

export default function AccordionClient({ locale }: { locale: string | Promise<string> }) {
   const [active, setActive] = useState(0);
   const [images, setImages] = useState<(string | undefined)[]>([]);

   useEffect(() => {
      let cancelled = false;
      (async () => {
         // resolve locale if it's a promise-like
         let resolvedLocale: string | undefined = typeof locale === "string" ? locale : undefined;
         if (typeof locale !== "string") {
            try {
               // locale can be a promise when passed from a server component
               // await promise-like locale
               resolvedLocale = await locale;
            } catch {
               resolvedLocale = undefined;
            }
         }

         if (!resolvedLocale) return;

         try {
            const res = await fetchAPI("/api/main-page-brands", resolvedLocale);
            if (res instanceof Error) return;
            const data = (res?.data ?? []) as BrandItem[];
            // take up to 7 images for panels
            const imgs = new Array(7).fill(undefined).map((_, i) => {
               const b = data[i];
               const url = b?.Brand?.formats?.large?.url ?? b?.Brand?.url;
               return resolveUrl(url ?? undefined);
            });
            if (!cancelled) setImages(imgs);
         } catch {
            // ignore fetch errors
         }
      })();
      return () => {
         cancelled = true;
      };
   }, [locale]);

   return (
      <div className={styles.accordion}>
         {DEFAULT_TITLES.map((t, i) => (
            <div
               key={i}
               className={`${styles.panel} ${i === active ? styles.active : ""}`}
               onMouseEnter={() => setActive(i)}
               style={{ backgroundImage: images[i] ? `url(${images[i]})` : undefined }}
            >
               <div className={styles["panel-content"]}>
                  <h2 className={styles["panel-title"]}>{t.title}</h2>
                  <p className={styles["panel-description"]}>{t.desc}</p>
               </div>
            </div>
         ))}
      </div>
   );
}
