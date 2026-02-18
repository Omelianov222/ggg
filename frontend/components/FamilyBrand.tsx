'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './FamilyBrand.module.css';
import { SectionHeader } from './UI/SectionHeader';
import GridBrands from './GridBrands';

type Brand = {
   name: string;
   desc: string;
};

const INITIAL_BRANDS: Brand[] = [
   { name: 'GALA', desc: 'Comfortable RIB boats designed for leisure' },
   { name: 'GALAXY', desc: 'Professional-grade boats' },
   { name: 'GELEX', desc: 'Versatile, multi-functional boats' },
];

// Детермінований порядок перемішування
const SWAP_SEQUENCE: [number, number][] = [
   [0, 2],
   [0, 1],
   [1, 2],
   [2, 1],
];

const ANIMATION_DURATION = 1000;
const CYCLE_INTERVAL = 7000;
const CLEANUP_DELAY = ANIMATION_DURATION + 500;

export default function FamilyBrand() {
   const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);

   const sectionRef = useRef<HTMLElement | null>(null);
   const intervalRef = useRef<number | null>(null);
   const animatingRef = useRef(false);

   const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
   const positionsRef = useRef<Map<string, DOMRect>>(new Map());
   const swapIndexRef = useRef(0);

   /* Знімаємо позиції ДО зміни порядку */
   const capturePositions = () => {
      const map = new Map<string, DOMRect>();
      cardsRef.current.forEach((el, key) => {
         if (el) map.set(key, el.getBoundingClientRect());
      });
      positionsRef.current = map;
   };

   const shuffleWithAnimation = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      capturePositions();

      setBrands(prev => {
         const next = [...prev];
         const [i, j] = SWAP_SEQUENCE[swapIndexRef.current];
         [next[i], next[j]] = [next[j], next[i]];
         swapIndexRef.current = (swapIndexRef.current + 1) % SWAP_SEQUENCE.length;
         return next;
      });

      setTimeout(() => {
         animatingRef.current = false;
      }, CLEANUP_DELAY);
   };

   /* Intersection Observer */
   useEffect(() => {
      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               if (intervalRef.current === null) {
                  intervalRef.current = window.setInterval(
                     shuffleWithAnimation,
                     CYCLE_INTERVAL
                  );
               }
            } else {
               if (intervalRef.current !== null) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
               }
            }
         },
         { threshold: 0.5 }
      );

      if (sectionRef.current) observer.observe(sectionRef.current);

      return () => {
         observer.disconnect();
         if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
         }
      };
   }, []);

   /* FLIP animation */
   useLayoutEffect(() => {
      cardsRef.current.forEach((el, key) => {
         const old = positionsRef.current.get(key);
         if (!old || !el) return;

         const current = el.getBoundingClientRect();
         const dx = old.left - current.left;
         const dy = old.top - current.top;

         if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

         el.style.transition = 'none';
         el.style.zIndex = '999';
         el.style.transform = `translate(${dx}px, ${dy}px) scale(0.96)`;

         void el.offsetWidth;

         requestAnimationFrame(() => {
            el.style.transition = `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`;
            el.style.transform = 'translate(0, 0) scale(1)';
         });

         setTimeout(() => {
            el.style.zIndex = '';
            el.style.transition = '';
         }, CLEANUP_DELAY);
      });
   }, [brands]);

   return (
      <section ref={sectionRef} className={styles.brands}>
         <SectionHeader title="OUR BRAND FAMILY" />
         <p className={styles.subtitle}>
            The GELEX GLOBAL GROUP factory produces boats under three brands
         </p>


         <div className={styles.grid}>
            <div className={`${styles.card} ${styles.main}`}>
               <Image
                  src="/GELEX-GLOBAL-GROUP-LOGO.png"
                  alt="GELEX"
                  width={250}
                  height={200}
                  style={{ height: 'auto' }}
               />
            </div>

            {brands.map(b => (
               <div
                  key={b.name}
                  ref={el => {
                     if (el) cardsRef.current.set(b.name, el);
                  }}
                  className={`${styles.card} ${styles.animated}`}
               >
                  <div className={styles.logoWrapper}>
                     <Image
                        src={`/${b.name}.png`}
                        alt={b.name}
                        width={150}
                        height={200}
                        style={{ height: 'auto', objectFit: 'contain' }}
                     />
                  </div>
                  <div className={styles.textWrapper}>
                     <p>{b.desc}</p>
                  </div>
               </div>
            ))}



         </div>
      </section>
   );
}
