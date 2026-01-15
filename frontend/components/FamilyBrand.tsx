'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './FamilyBrand.module.css';

type Brand = {
   name: string;
   desc: string;
};

const INITIAL_BRANDS: Brand[] = [
   { name: 'GALA', desc: 'comfortable RIB boats designed for leisure' },
   { name: 'GALAXY', desc: 'professional-grade boats' },
   { name: 'GELEX', desc: 'versatile, multi-functional boats' },
];

// Детермінований порядок перемішування: 1↔3, 1↔2, 2↔3, 3↔2
const SWAP_SEQUENCE = [
   [0, 2], // 1 з 3
   [0, 1], // 1 і 2
   [1, 2], // 2 і 3
   [2, 1], // 3 і 2
];

const ANIMATION_DURATION = 1000;
const CYCLE_INTERVAL = 7000;
const CLEANUP_DELAY = ANIMATION_DURATION + 500;

export default function FamilyBrand() {
   const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
   const animatingRef = useRef(false);
   const sectionRef = useRef<HTMLElement | null>(null);
   const intervalRef = useRef<number | null>(null);
   const positionsRef = useRef<Map<string, DOMRect>>(new Map());
   const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
   const swapIndexRef = useRef(0);
   const isFirstRenderRef = useRef(true);

   const shuffleWithAnimation = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      // Детерміноване перемішування
      setBrands(prev => {
         const newBrands = [...prev];
         const [i, j] = SWAP_SEQUENCE[swapIndexRef.current];
         [newBrands[i], newBrands[j]] = [newBrands[j], newBrands[i]];

         // Переходимо до наступного кроку циклу
         swapIndexRef.current = (swapIndexRef.current + 1) % SWAP_SEQUENCE.length;

         return newBrands;
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
                  intervalRef.current = window.setInterval(shuffleWithAnimation, CYCLE_INTERVAL);
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
      // При першому рендері тільки зберігаємо позиції, без анімації
      if (isFirstRenderRef.current) {
         const newMap = new Map<string, DOMRect>();
         cardsRef.current.forEach((el, key) => {
            if (el) newMap.set(key, el.getBoundingClientRect());
         });
         positionsRef.current = newMap;
         isFirstRenderRef.current = false;
         return;
      }

      // FLIP анімація для наступних рендерів
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

         // Примусовий reflow
         void el.offsetWidth;

         requestAnimationFrame(() => {
            el.style.transition = `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`;
            el.style.transform = 'translate(0px, 0px) scale(1)';
         });

         setTimeout(() => {
            el.style.zIndex = '';
            el.style.transition = '';
         }, CLEANUP_DELAY);
      });

      // Оновлюємо позиції для наступного разу
      const newMap = new Map<string, DOMRect>();
      cardsRef.current.forEach((el, key) => {
         if (el) newMap.set(key, el.getBoundingClientRect());
      });
      positionsRef.current = newMap;
   }, [brands]);

   return (
      <>
         <section ref={sectionRef} className={styles.brands}>
            <h2>OUR BRAND FAMILY</h2>
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
                        <strong>{b.name}</strong>
                        <p>{b.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </section>
      </>
   );
}