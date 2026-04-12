"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./AccordionClient.module.css";

type BrandItem = {
   title: string;
   image?: string;
};

const FALLBACK_ITEMS: BrandItem[] = Array.from({ length: 5 }, (_, i) => ({
   title: `Gala${i + 1}`,
}));

type Props = {
   brands?: BrandItem[];
};

export default function AccordionClient({ brands }: Props) {
   const displayItems = brands ?? FALLBACK_ITEMS;

   const [imagesLoaded, setImagesLoaded] = useState(false);
   const [introFinished, setIntroFinished] = useState(false);
   const accordionRef = useRef<HTMLDivElement>(null);
   const introRef = useRef<HTMLDivElement | null>(null);
   const introStartedRef = useRef(false);

   // Preload images client-side — only async setState allowed in effects
   useEffect(() => {
      const imageUrls = displayItems
         .map((b) => b.image)
         .filter((url): url is string => !!url);

      if (imageUrls.length === 0) {
         setImagesLoaded(true);
         return;
      }

      let cancelled = false;
      Promise.all(
         imageUrls.map(
            (url) =>
               new Promise<void>((resolve) => {
                  const img = new Image();
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                  img.src = url;
               })
         )
      ).then(() => {
         if (!cancelled) setImagesLoaded(true);
      });

      return () => { cancelled = true; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []); // run once — brands come from server and don't change

   // Trigger panel entrance animation after both intro and images are ready
   useEffect(() => {
      if (!imagesLoaded || !introFinished) return;

      const panels = accordionRef.current?.querySelectorAll(`.${styles.panel}`);
      panels?.forEach((panel, index) => {
         setTimeout(() => panel.classList.add(styles.animate), index * 100);
      });
   }, [imagesLoaded, introFinished]);

   // Intro logo animation — runs once on mount
   useEffect(() => {
      if (introStartedRef.current) return;
      const el = introRef.current;
      if (!el) return;
      introStartedRef.current = true;

      const logoBlock = el.querySelector(`.${styles["logo-block"]}`);
      if (logoBlock) logoBlock.classList.add(styles["logo-anim"]);

      const timer = setTimeout(() => setIntroFinished(true), 3400);
      return () => clearTimeout(timer);
   }, []);

   // Notify Navbar (and others) when intro is done
   useEffect(() => {
      if (!introFinished) return;
      try {
         (window as any).__introFinished = true;
         window.dispatchEvent(new CustomEvent("introFinished"));
      } catch {
         // ignore in non-browser contexts
      }
   }, [introFinished]);

   // Block scroll while intro or images are loading
   useEffect(() => {
      document.body.style.overflow = introFinished && imagesLoaded ? "" : "hidden";
      return () => { document.body.style.overflow = ""; };
   }, [introFinished, imagesLoaded]);

   return (
      <div className={styles.accordionWrapper}>
         {!introFinished && (
            <div className={styles["intro-overlay"]} ref={introRef} aria-hidden="true">
               <div className={styles["logo-block"]}>
                  <div className={styles["logo-flip"]}>
                     <img className={styles["logo-front"]} src="/logo3.svg" alt="Logo" />
                     <img className={styles["logo-back"]} src="/ecoLogo.png" alt="Eco Logo" />
                  </div>
               </div>
            </div>
         )}
         <div className={styles.accordion} ref={accordionRef}>
            {displayItems.map((item, i) => (
               <label key={i} className={styles.panelLabel} style={{ zIndex: 100 - i }}>
                  <input
                     type="radio"
                     name="accordion"
                     className={styles.panelRadio}
                     defaultChecked={i === 0}
                  />
                  <div className={`${styles.panel} ${styles.hasSkew}`}>
                     {i === 0 ? (
                        <div className={styles.panelBackground}>
                           <video
                              src="/sait.mp4"
                              autoPlay
                              muted
                              loop
                              playsInline
                              aria-hidden="true"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                           />
                        </div>
                     ) : item.image ? (
                        <div
                           className={styles.panelBackground}
                           style={{ backgroundImage: `url(${item.image})` }}
                        />
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
