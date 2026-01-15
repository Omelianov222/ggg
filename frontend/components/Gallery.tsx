'use client';

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

interface GalleryProps {
   images: { id: string | number; url: string; alt?: string }[];
}

export default function Gallery({ images }: GalleryProps) {
   const MAX_ITEMS_PER_COLUMN = 4; // Максимум фото в одному стовпці
   const TOTAL_COLUMNS = 4;
   const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set());
   const [isOpen, setIsOpen] = useState(false);
   const [currentIndex, setCurrentIndex] = useState<number | null>(null);

   const handleLoad = (index: number) => {
      setLoadedItems(prev => new Set(prev).add(index));
   };

   const openAt = (index: number) => {
      setCurrentIndex(index);
      setIsOpen(true);
   };

   const close = () => {
      setIsOpen(false);
      setCurrentIndex(null);
   };

   const showNext = useCallback(() => {
      setCurrentIndex((ci) => (ci === null ? null : (ci + 1) % images.length));
   }, [images.length]);

   const showPrev = useCallback(() => {
      setCurrentIndex((ci) => (ci === null ? null : (ci - 1 + images.length) % images.length));
   }, [images.length]);

   useEffect(() => {
      if (!isOpen) return;
      const onKey = (e: KeyboardEvent) => {
         if (e.key === 'Escape') close();
         if (e.key === 'ArrowRight') showNext();
         if (e.key === 'ArrowLeft') showPrev();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
   }, [isOpen, showNext, showPrev]);
   // Функція для визначення, до якого стовпчика потрапить зображення
   const getColumnIndex = (imageIndex: number, totalColumns: number = TOTAL_COLUMNS) => {
      return imageIndex % totalColumns;
   };
   // Функція для визначення позиції зображення у своєму стовпчику
   const getPositionInColumn = (imageIndex: number, totalColumns: number = 4) => {
      return Math.floor(imageIndex / totalColumns);
   };
   // Обмеження кількості зображень
   const maxImages = MAX_ITEMS_PER_COLUMN * TOTAL_COLUMNS;
   const displayImages = images.slice(0, maxImages);
   return (
      <div className={styles.masonry}>
         {displayImages.map((img, index) => {
            const columnIndex = getColumnIndex(index);
            const positionInColumn = getPositionInColumn(index);

            // Визначаємо пропорцію залежно від стовпчика та позиції
            // Парні стовпчики (0, 2): починають з 16:9, потім 1.91:1
            // Непарні стовпчики (1, 3): починають з 1.91:1, потім 16:9
            let shouldCrop16x9, shouldCrop191x1;

            if (columnIndex % 2 === 0) {
               // Парні стовпчики: 16:9 на парних позиціях, 1.91:1 на непарних
               shouldCrop16x9 = positionInColumn % 2 === 0;
               shouldCrop191x1 = positionInColumn % 2 === 1;
            } else {
               // Непарні стовпчики: 1.91:1 на парних позиціях, 16:9 на непарних
               shouldCrop16x9 = positionInColumn % 2 === 1;
               shouldCrop191x1 = positionInColumn % 2 === 0;
            }

            // Визначаємо пропорцію для обрізки
            let cropStyle = {};
            if (shouldCrop191x1) {
               cropStyle = {
                  width: '100%',
                  paddingBottom: `${(1 / 2.1) * 100}%`, // 1/1.91 = 52.36%
                  position: 'relative',
                  overflow: 'hidden'
               };
            } else if (shouldCrop16x9) {
               cropStyle = {
                  width: '100%',
                  paddingBottom: '56.25%', // 16:9
                  position: 'relative',
                  overflow: 'hidden'
               };
            }

            const shouldApplyCrop = shouldCrop16x9 || shouldCrop191x1;
            return (
               <div
                  key={index}
                  className={`${styles['masonry-item']} ${loadedItems.has(index) ? styles.loaded : ''} ${shouldApplyCrop ? styles.cropped : ''}`}
                  onClick={() => openAt(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') openAt(index);
                  }}
               >
                  <div style={cropStyle}>
                     <Image
                        src={img.url}
                        alt={img.alt || "Gallery image"}
                        width={500}
                        height={500}
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 25vw"
                        style={shouldApplyCrop ? {
                           position: 'absolute',
                           top: '50%',
                           left: '50%',
                           transform: 'translate(-50%, -50%)',
                           width: '100%',
                           height: '100%',
                           objectFit: 'cover',
                           cursor: 'zoom-in'
                        } : {
                           width: "100%",
                           height: "auto",
                           cursor: 'zoom-in'
                        }}
                        placeholder="blur"
                        blurDataURL="/placeholder.png"
                        onLoad={() => handleLoad(index)}
                     />
                  </div>
               </div>
            );
         })}

         {isOpen && currentIndex !== null && (
            <div className={styles.modalOverlay} onClick={close} role="dialog" aria-modal="true">
               <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.closeBtn} onClick={close} aria-label="Close">✕</button>
                  <button className={styles.prevBtn} onClick={showPrev} aria-label="Previous">‹</button>
                  <div className={styles.modalImageWrapper}>
                     <Image
                        src={images[currentIndex].url}
                        alt={images[currentIndex].alt || 'Gallery image'}
                        width={1200}
                        height={800}
                        style={{ width: '100%', height: 'auto' }}
                     />
                  </div>
                  <button className={styles.nextBtn} onClick={showNext} aria-label="Next">›</button>
               </div>
            </div>
         )}
      </div>
   );
}
