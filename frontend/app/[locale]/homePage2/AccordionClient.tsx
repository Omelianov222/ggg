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

export default function AccordionClient({ locale }: { locale: Promise<string> | string }) {
   const [items, setItems] = useState<{ title: string; desc: string; image?: string }[]>([]);
   const [resolvedLocale, setResolvedLocale] = useState<string | null>(null);
   const [imagesLoaded, setImagesLoaded] = useState(false);
   const [introFinished, setIntroFinished] = useState(false);
   const accordionRef = useRef<HTMLDivElement>(null);
   const introRef = useRef<HTMLDivElement | null>(null);
   const introStartedRef = useRef(false);

   // (removed mobile listener — not used in this component)

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

            if (data.length === 0) {
               const defaultItems = Array.from({ length: 4 }, (_, i) => ({
                  title: `Gala${i + 1}`,
                  desc: `${i + 1}`,
               }));
               setItems(defaultItems);
               setImagesLoaded(true);
               return;
            }

            const itemsWithImages = data.map((b, i) => ({
               title: b.BrandLabel || `Gala${i + 1}`,
               desc: `${i + 1}`,
               image: resolveUrl(b?.Brand?.url),
            }));

            setItems(itemsWithImages.splice(0, 5));

            const imageUrls = itemsWithImages
               .map(item => item.image)
               .filter((url): url is string => !!url);

            if (imageUrls.length === 0) {
               setImagesLoaded(true);
               return;
            }

            const imagePromises = imageUrls.map(
               url =>
                  new Promise((resolve) => {
                     const img = new Image();
                     img.onload = resolve;
                     img.onerror = resolve;
                     img.src = url;
                  })
            );

            await Promise.all(imagePromises);

            if (!cancelled) {
               setImagesLoaded(true);
            }
         } catch {
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

      const panels = accordionRef.current?.querySelectorAll(`.${styles.panel}`);
      panels?.forEach((panel, index) => {
         setTimeout(() => {
            panel.classList.add(styles.animate);
         }, index * 100);
      });
   }, [imagesLoaded, items.length]);

   // Run intro animation once on mount and always let it finish (~4.4s)
   useEffect(() => {
      if (introStartedRef.current) return;
      const el = introRef.current
      if (!el) return
      introStartedRef.current = true

      const logoBlock = el.querySelector(`.${styles['logo-block']}`)
      if (logoBlock) {
         logoBlock.classList.add(styles['logo-anim'])
      }

      const timer = setTimeout(() => {
         window.dispatchEvent(new Event('introComplete'))
         setIntroFinished(true)
      }, 4400)

      return () => clearTimeout(timer)
   }, [])

   const hasMultiplePanels = items.length > 1;

   return (
      <div className={styles.accordionWrapper}>
         {/* Intro overlay: show until introFinished — independent from image loading */}
         {!introFinished && (
            <div className={styles['intro-overlay']} ref={introRef} aria-hidden="true">
               <div className={styles['logo-block']}>
                  <div className={styles['logo-flip']}>
                     <img className={styles['logo-front']} src="/logo3.svg" alt="Logo" />
                     <img className={styles['logo-back']} src="/ecoLogo.png" alt="Eco Logo" />
                  </div>
               </div>
            </div>
         )}
         <div className={styles.accordion} ref={accordionRef}>
            {items.map((item, i) => (
               <label key={i} className={styles.panelLabel} style={{ zIndex: 100 - i }}>
                  <input
                     type="radio"
                     name="accordion"
                     className={styles.panelRadio}
                     defaultChecked={i === 0}
                  />
                  <div className={`${styles.panel} ${hasMultiplePanels ? styles.hasSkew : ''}`}>
                     {i === 0 ? (
                        <div className={styles.panelBackground}>
                           <video
                              src="/record-2025-12-19_15.33.57.mp4"
                              autoPlay
                              muted
                              loop
                              playsInline
                              aria-hidden="true"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                           />
                        </div>
                     ) : item.image ? (
                        <div className={styles.panelBackground} style={{ backgroundImage: `url(${item.image})` }} />
                     ) : null}
                     <div className={styles["panel-content"]}>

                     </div>
                  </div>
               </label>
            ))}
         </div>

      </div>
   );
}