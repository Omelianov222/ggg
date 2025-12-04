"use client";
import React, { useEffect, useRef } from "react";
import styles from "./LandingGrid.module.css";

type LandingGridProps = { attributes?: any; locale: string };

function resolveUrl(path?: string) {
   if (!path) return undefined;
   if (path.startsWith("http")) return path;
   const base = process.env.NEXT_PUBLIC_API_URL ?? "";
   return base.replace(/\/$/, "") + path;
}

export default function LandingGrid({ attributes, locale }: LandingGridProps) {
   const baseRef = useRef<HTMLDivElement | null>(null);
   const middleRef = useRef<HTMLDivElement | null>(null);
   const logoFixedRef = useRef<HTMLDivElement | null>(null);
   const navbarRef = useRef<HTMLElement | null>(null);

   useEffect(() => {
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
   }, []);


   return (
      <div className={styles["lg-body"]}>
         <div className={styles.wrap}>
            <div className={styles["grid-base"]} role="list" ref={baseRef}>
               <div className={styles.card} role="listitem" data-card>
                  <img src={resolveUrl(attributes?.heroImage?.data?.attributes?.url) ?? "https://gala.boats/wp-content/uploads/2025/08/VPelagalli_1584-scaled.jpg"} alt="" />
               </div>
               <div className={styles.card} role="listitem" data-card>
                  <img src={resolveUrl(attributes?.card2Image?.data?.attributes?.url) ?? "https://gala.boats/wp-content/uploads/2024/04/GALA-inflatable-boats-Home_1.png"} alt="" />
               </div>
               <div className={styles.card} role="listitem" data-card>
                  <img src={resolveUrl(attributes?.card3Image?.data?.attributes?.url) ?? "https://gala.boats/wp-content/uploads/2025/07/GALA-inflatable-boats-Home_12-scaled.jpg"} alt="" />
               </div>
               <div className={styles.card} role="listitem" data-card>
                  <img src={resolveUrl(attributes?.card4Image?.data?.attributes?.url) ?? "https://gala.boats/wp-content/uploads/2024/04/GALA-inflatable-boats-Home_3.png"} alt="" />
               </div>
            </div>

            <div className={styles["grid-middle"]} role="list" ref={middleRef}>
               <div className={styles.card} role="listitem" data-card>
                  <img src={resolveUrl(attributes?.middle1Image?.data?.attributes?.url) ?? "https://gala.boats/wp-content/uploads/2024/04/GALA-inflatable-boats-Home_6.jpg"} alt="" />
               </div>
               <div className={styles.card} role="listitem" data-card>
                  <img src={resolveUrl(attributes?.middle2Image?.data?.attributes?.url) ?? "https://gala.boats/wp-content/uploads/2024/04/GALA-inflatable-boats-Home_4.png"} alt="" />
               </div>
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
