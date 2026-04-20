"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./AccordionClient.module.css";

type BrandItem = {
   id?: number;
   BrandLabel?: string;
   Brand?: { url?: string; formats?: { large?: { url?: string } } };
};

type DisplayItem = { title: string; desc: string; image?: string };

function resolveUrl(path?: string) {
   if (!path) return undefined;
   if (path.startsWith("http")) return path;
   const base = process.env.NEXT_PUBLIC_API_URL ?? "";
   return base.replace(/\/$/, "") + path;
}

export default function AccordionClient({ initialData }: { initialData: BrandItem[] }) {
   const [items, setItems] = useState<DisplayItem[]>([]);
   const [imagesLoaded, setImagesLoaded] = useState(false);
   const [introFinished, setIntroFinished] = useState(false);
   const accordionRef = useRef<HTMLDivElement>(null);
   const introRef = useRef<HTMLDivElement | null>(null);
   const introStartedRef = useRef(false);

   // Обробка даних і передзавантаження зображень
   useEffect(() => {
      if (initialData.length === 0) {
         setItems(Array.from({ length: 4 }, (_, i) => ({ title: `Gala${i + 1}`, desc: `${i + 1}` })));
         setImagesLoaded(true);
         return;
      }

      const mapped: DisplayItem[] = initialData
         .map((b, i) => ({
            title: b.BrandLabel || `Gala${i + 1}`,
            desc: `${i + 1}`,
            image: resolveUrl(b?.Brand?.url),
         }))
         .sort((a, b) => {
            if (a.title === "Video") return -1;
            if (b.title === "Video") return 1;
            return 0;
         });

      const displayItems = mapped.slice(0, 6);
      setItems(displayItems);

      const imageUrls = displayItems.map(item => item.image).filter((url): url is string => !!url);

      if (imageUrls.length === 0) {
         setImagesLoaded(true);
         return;
      }

      Promise.all(
         imageUrls.map(
            url => new Promise<void>(resolve => {
               const img = new Image();
               img.onload = () => resolve();
               img.onerror = () => resolve();
               img.src = url;
            })
         )
      ).then(() => setImagesLoaded(true));
   }, []);

   useEffect(() => {
      if (!imagesLoaded || items.length === 0 || !introFinished) return;

      const panels = accordionRef.current?.querySelectorAll(`.${styles.panel}`);
      panels?.forEach((panel, index) => {
         setTimeout(() => {
            panel.classList.add(styles.animate);
         }, index * 100);
      });
   }, [imagesLoaded, items.length, introFinished]);

   useEffect(() => {
      if (introStartedRef.current) return;
      const el = introRef.current;
      if (!el) return;
      introStartedRef.current = true;

      const logoBlock = el.querySelector(`.${styles['logo-block']}`);
      if (logoBlock) logoBlock.classList.add(styles['logo-anim']);

      const timer = setTimeout(() => setIntroFinished(true), 3400);
      return () => clearTimeout(timer);
   }, []);

   useEffect(() => {
      if (!introFinished) return;
      try {
         (window as any).__introFinished = true;
         window.dispatchEvent(new CustomEvent('introFinished'));
      } catch {
         // ignore in non-browser contexts
      }
   }, [introFinished]);

   useEffect(() => {
      document.body.style.overflow = (introFinished && imagesLoaded) ? '' : 'hidden';
      return () => { document.body.style.overflow = ''; };
   }, [introFinished, imagesLoaded]);

   return (
      <div className={styles.accordionWrapper}>
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
                  <input type="radio" name="accordion" className={styles.panelRadio} defaultChecked={i === 0} />
                  <div className={`${styles.panel} ${styles.hasSkew}`}>
                     {i === 0 ? (
                        <div className={styles.panelBackground}>
                           <video src="/sait.mp4" autoPlay muted loop playsInline aria-hidden="true"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                     ) : item.image ? (
                        <div className={styles.panelBackground} style={{ backgroundImage: `url(${item.image})` }} />
                     ) : null}
                     <div className={styles["panel-content"]} />
                     {i === 0 && (
                        <div className={styles.scrollIndicator} aria-hidden="true">
                           <span className={styles.scrollArrow}>︾</span>
                        </div>
                     )}
                  </div>
               </label>
            ))}
         </div>
      </div>
   );
}
