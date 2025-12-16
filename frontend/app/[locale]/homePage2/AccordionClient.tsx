"use client";
import React, { useEffect, useRef, useState } from "react";
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

export default function AccordionClient({ locale }: { locale: string | Promise<string> }) {
   const [items, setItems] = useState<{ title: string; desc: string; image?: string }[]>([]);
   const [resolvedLocale, setResolvedLocale] = useState<string | null>(null);
   const [imagesLoaded, setImagesLoaded] = useState(false);
   const [slideComplete, setSlideComplete] = useState(false);
   const accordionRef = useRef<HTMLDivElement>(null);
   const hoverTimeout = useRef<number | null>(null);
   const HOVER_DELAY = 220;

   useEffect(() => {
      (async () => {
         const resolved = typeof locale === "string" ? locale : await locale;
         setResolvedLocale(resolved);
      })();
   }, [locale]);

   useEffect(() => {
      if (!resolvedLocale) return;
      let cancelled = false;

      (async () => {
         try {
            const res = await fetchAPI("/api/main-page-brands", resolvedLocale);
            if (res instanceof Error || cancelled) return;

            const data = (res?.data ?? []) as BrandItem[];

            // Якщо немає даних з API, використовуємо дефолтні значення
            if (data.length === 0) {
               const defaultItems = Array.from({ length: 7 }, (_, i) => ({
                  title: `Gala${i + 1}`,
                  desc: `${i + 1}`,
               }));
               setItems(defaultItems);
               setImagesLoaded(true);
               return;
            }

            // Створюємо масив елементів з даних API
            const itemsWithImages = data.map((b, i) => ({
               title: b.BrandLabel || `Gala${i + 1}`,
               desc: `${i + 1}`,
               image: resolveUrl(b?.Brand?.formats?.large?.url ?? b?.Brand?.url),
            }));

            setItems(itemsWithImages);

            // Завантажуємо всі зображення
            const imageUrls = itemsWithImages
               .map(item => item.image)
               .filter((url): url is string => !!url);

            if (imageUrls.length === 0) {
               setImagesLoaded(true);
               return;
            }

            // Чекаємо поки всі зображення завантажаться
            const imagePromises = imageUrls.map(
               url =>
                  new Promise((resolve, reject) => {
                     const img = new Image();
                     img.onload = resolve;
                     img.onerror = resolve; // Продовжуємо навіть якщо зображення не завантажилось
                     img.src = url;
                  })
            );

            await Promise.all(imagePromises);

            if (!cancelled) {
               setImagesLoaded(true);
            }
         } catch {
            // У випадку помилки показуємо дефолтні елементи
            if (!cancelled) {
               const defaultItems = Array.from({ length: 7 }, (_, i) => ({
                  title: `Gala${i + 1}`,
                  desc: `${i + 1}`,
               }));
               setItems(defaultItems);
               setImagesLoaded(true);
            }
         }
      })();

      return () => {
         cancelled = true;
      };
   }, [resolvedLocale]);

   useEffect(() => {
      if (!imagesLoaded || items.length === 0) return;

      // Додаємо анімацію до кожної панелі з затримкою
      const panels = accordionRef.current?.querySelectorAll(`.${styles.panel}`);
      panels?.forEach((panel, index) => {
         setTimeout(() => {
            panel.classList.add(styles.animate);
         }, index * 100);
      });

      // Розраховуємо загальний час анімації
      const totalAnimationTime = (items.length - 1) * 100 + 800;

      const timer = setTimeout(() => {
         setSlideComplete(true);
      }, totalAnimationTime);

      return () => clearTimeout(timer);
   }, [imagesLoaded, items.length]);

   const handleMouseEnter = (i: number) => {
      if (!slideComplete) return;

      if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
      hoverTimeout.current = window.setTimeout(() => {
         const panels = accordionRef.current?.querySelectorAll(`.${styles.panel}`);
         panels?.forEach((panel, index) => {
            if (index === i) {
               panel.classList.add(styles.active);
            } else {
               panel.classList.remove(styles.active);
            }
         });
      }, HOVER_DELAY);
   };

   const handleMouseLeave = () => {
      if (hoverTimeout.current) {
         window.clearTimeout(hoverTimeout.current);
         hoverTimeout.current = null;
      }
   };

   const hasMultiplePanels = items.length > 1;

   return (
      <div className={`${styles.accordionWrapper} ${slideComplete ? styles.slideComplete : ''}`}>
         {!imagesLoaded && <div className={styles.loader}></div>}
         <div className={styles.accordion} ref={accordionRef}>
            {items.map((item, i) => (
               <div
                  key={i}
                  className={`${styles.panel} ${hasMultiplePanels ? styles.hasClip : ''} ${i === 0 ? styles.active : ""}`}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                  style={{ backgroundImage: item.image ? `url(${item.image})` : undefined }}
               >
                  <div className={styles["panel-content"]}>
                     <h2 className={styles["panel-title"]}>{item.title}</h2>
                     <p className={styles["panel-description"]}>{item.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}