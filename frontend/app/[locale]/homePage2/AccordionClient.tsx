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

const DEFAULT_TITLES = [
   { title: "GAla1", desc: "1" },
   { title: "Gala2", desc: "2" },
   { title: "Gala3", desc: "3" },
   { title: "Gala4", desc: "4" },
   { title: "Gala5", desc: "5" },
   { title: "Gala6", desc: "6" },
   { title: "Gala7", desc: "7" },
];

export default function AccordionClient({ locale }: { locale: string | Promise<string> }) {
   const [images, setImages] = useState<(string | undefined)[]>([]);
   const [resolvedLocale, setResolvedLocale] = useState<string | null>(null);
   const [radarComplete, setRadarComplete] = useState(false);
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
   }, [resolvedLocale]);

   useEffect(() => {
      // Запускаємо анімацію радара
      const timer = setTimeout(() => {
         setRadarComplete(true);
      }, 3000); // 3 секунди - час анімації радара

      return () => clearTimeout(timer);
   }, []);

   const handleMouseEnter = (i: number) => {
      if (!radarComplete) return; // Блокуємо взаємодію під час анімації радара

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

   return (
      <div className={`${styles.accordionWrapper} ${radarComplete ? styles.radarComplete : ''}`}>
         <div className={styles.radarOrigin}></div>
         <div className={styles.accordion} ref={accordionRef}>
            {DEFAULT_TITLES.map((t, i) => (
               <div
                  key={i}
                  className={`${styles.panel} ${i === 0 ? styles.active : ""}`}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                  style={{ backgroundImage: images[i] ? `url(${images[i]})` : undefined }}
               >
                  <div className={styles["panel-content"]}>
                     <h2 className={styles["panel-title"]}>{t.title}</h2>
                     <p className={styles["panel-description"]}>{t.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}