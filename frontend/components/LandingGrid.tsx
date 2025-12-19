"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./LandingGrid.module.css";
import { fetchAPI } from "@/app/lib/api";

type LandingGridProps = { attributes?: unknown; locale: string | Promise<string> };

type BrandItem = {
   id?: number;
   BrandLabel?: string;
   Brand?: {
      url?: string;
      formats?: { large?: { url?: string } };
   };
};

type MainPageBrandsResponse = {
   data?: BrandItem[];
   meta?: Record<string, unknown>;
};

function resolveUrl(path?: string) {
   if (!path) return undefined;
   if (path.startsWith("http")) return path;
   const base = process.env.NEXT_PUBLIC_API_URL ?? "";
   return base.replace(/\/$/, "") + path;
}

export default function LandingGrid({ attributes, locale }: LandingGridProps) {
   const [brands, setBrands] = useState<BrandItem[] | null>(null);
   const baseRef = useRef<HTMLDivElement | null>(null);
   const middleRef = useRef<HTMLDivElement | null>(null);
   const logoFixedRef = useRef<HTMLDivElement | null>(null);
   const navbarRef = useRef<HTMLElement | null>(null);

   useEffect(() => {
      // Resolve locale (it may be a Promise when coming from server components)
      (async () => {
         let resolvedLocale = typeof locale === "string" ? locale : undefined;
         if (typeof locale !== "string") {
            try {
               resolvedLocale = await locale;
            } catch (e) {
               console.error("Failed to resolve locale promise", e);
               resolvedLocale = undefined;
            }
         }

         if (!resolvedLocale) {
            console.warn("Locale not available for LandingGrid; skipping brands fetch");
            return;
         }

         // fetch brands from API (client-side) using fetchAPI helper
         try {
            const res = await fetchAPI("/api/main-page-brands", resolvedLocale);
            if (res instanceof Error) {
               console.error('fetchAPI returned an Error', res.message);
            } else {
               // res should be parsed JSON already (see app/lib/api.fetchAPI)
               const json = res as MainPageBrandsResponse;
               setBrands(Array.isArray(json.data) ? json.data : (json.data ? [json.data] : null));
            }
         } catch (err) {
            console.error('Error fetching brands', err);
         }
      })();


      const baseCards =
         baseRef.current?.querySelectorAll<HTMLDivElement>("[data-card]") ?? [];
      const middleCards =
         middleRef.current?.querySelectorAll<HTMLDivElement>("[data-card]") ?? [];

      const allCards = [...baseCards, ...middleCards];

      // додаємо клас анімації логотипу
      const logoBlock = document.querySelector(`.${styles["logo-block"]}`);
      if (logoBlock) {
         logoBlock.classList.add(styles["logo-anim"]);
      }

      allCards.forEach((c) => {
         c.style.opacity = "0";
         c.style.transform = "scale(0.9)";
      });

      setTimeout(() => {
         const order = [
            baseCards[0],
            middleCards[0],
            baseCards[1],
            baseCards[3],
            middleCards[1],
            baseCards[2],
         ];
         order.forEach((card, i) => {
            setTimeout(() => {
               if (!card) return;
               card.style.opacity = "1";
               card.style.transform = "scale(1)";
            }, i * 200);
         });
      }, 2000);

      setTimeout(() => {
         if (!logoFixedRef.current) return;
         logoFixedRef.current.style.display = "flex";
         logoFixedRef.current.getBoundingClientRect();
         logoFixedRef.current.style.opacity = "1";

         if (navbarRef.current) {
            navbarRef.current.style.opacity = "1";
            navbarRef.current.style.pointerEvents = "auto";
            const items = navbarRef.current.querySelectorAll("li");
            items.forEach((li, i) => {
               setTimeout(() => {
                  const el = li as HTMLElement;
                  el.getBoundingClientRect();
                  el.style.opacity = "1";
                  el.style.transform = "translateX(0)";
               }, 200 * i);
            });
         }
      }, 4400);
   }, [locale]);


   return (
      <div className={styles["lg-body"]}>
         <div className={styles.wrap}>
            <div className={styles["grid-base"]} role="list" ref={baseRef}>
               {/* If brands fetched, render first 4 brand images; otherwise fall back to attributes */}
               {(brands && brands.length > 0 ? brands.slice(0, 4) : [null, null, null, null]).map((b, idx) => {
                  const url = b?.Brand?.formats?.large?.url ?? b?.Brand?.url ?? (
                     // fallbacks to attributes for backward compatibility
                     idx === 0
                        ? attributes?.heroImage?.data?.attributes?.url
                        : idx === 1
                           ? attributes?.card2Image?.data?.attributes?.url
                           : idx === 2
                              ? attributes?.card3Image?.data?.attributes?.url
                              : attributes?.card4Image?.data?.attributes?.url
                  );
                  const resolved = resolveUrl(url);
                  return (
                     <div key={idx} className={styles.card} role="listitem" data-card>
                        {resolved ? <img src={resolved} alt={b?.BrandLabel ?? attributes?.BrandLabel ?? ""} /> : null}
                     </div>
                  );
               })}
            </div>

            <div className={styles["grid-middle"]} role="list" ref={middleRef}>
               {(brands && brands.length > 4 ? brands.slice(4, 6) : [null, null]).map((b, idx) => {
                  const url = b?.Brand?.formats?.large?.url ?? b?.Brand?.url ?? (idx === 0 ? attributes?.middle1Image?.data?.attributes?.url : attributes?.middle2Image?.data?.attributes?.url);
                  const resolved = resolveUrl(url);
                  return (
                     <div key={idx} className={styles.card} role="listitem" data-card>
                        {resolved ? <img src={resolved} alt={b?.BrandLabel ?? ""} /> : null}
                     </div>
                  );
               })}
            </div>

            <div className={styles["logo-block"]}>
               <div className={styles["logo-flip"]}>
                  <img className={styles["logo-front"]} src="/logo3.svg" alt="Logo" />
                  <img className={styles["logo-back"]} src="/ecoLogo.png" alt="Eco Logo" />
               </div>
            </div>
         </div>
      </div>
   );
}
