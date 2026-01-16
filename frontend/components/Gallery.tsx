'use client';

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

interface GalleryProps {
   images: { id: string | number; url: string; alt?: string }[];
}

export default function Gallery({ images }: GalleryProps) {
   const ITEMS_PER_PAGE = 16;
   const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);

   const [page, setPage] = useState(1);
   const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set());
   const [isOpen, setIsOpen] = useState(false);
   const [currentIndex, setCurrentIndex] = useState<number | null>(null);
   const [isLoading, setIsLoading] = useState(false);

   const start = (page - 1) * ITEMS_PER_PAGE;
   const end = start + ITEMS_PER_PAGE;
   const displayImages = images.slice(start, end);

   const handlePageChange = (newPage: number) => {
      setIsLoading(true);
      setPage(newPage);
      setTimeout(() => setIsLoading(false), 300);
   };

   const openAt = (index: number) => {
      setCurrentIndex(start + index);
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

   const getAspectRatio = (index: number) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const isEvenCol = col % 2 === 0;
      const isEvenRow = row % 2 === 0;

      return (isEvenCol && isEvenRow) || (!isEvenCol && !isEvenRow)
         ? { paddingBottom: '56.25%' } // 16:9
         : { paddingBottom: '47.62%' }; // 1.91:1
   };

   const getPaginationRange = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = 1; i <= totalPages; i++) {
         if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
            range.push(i);
         }
      }

      let prev = 0;
      for (const i of range) {
         if (i - prev > 1) rangeWithDots.push('...');
         rangeWithDots.push(i);
         prev = i;
      }

      return rangeWithDots;
   };

   return (
      <>
         <div className={`${styles.masonry} ${isLoading ? styles.loading : ''}`}>
            {displayImages.map((img, index) => (
               <div
                  key={index}
                  className={`${styles['masonry-item']} ${loadedItems.has(index) ? styles.loaded : ''}`}
                  onClick={() => openAt(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') openAt(index);
                  }}
               >
                  <div style={{ ...getAspectRatio(index), position: 'relative', overflow: 'hidden' }}>
                     <Image
                        src={img.url}
                        alt={img.alt || "Gallery image"}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 25vw"
                        style={{ objectFit: 'cover', cursor: 'zoom-in' }}
                        placeholder="blur"
                        blurDataURL="/placeholder.png"
                        onLoad={() => setLoadedItems(prev => new Set(prev).add(index))}
                     />
                  </div>
               </div>
            ))}
         </div>

         <div className={styles.pagination}>
            <button
               className={styles.pageBtn}
               disabled={page === 1}
               onClick={() => handlePageChange(page - 1)}
               aria-label="Previous page"
            >
               ‹
            </button>

            {getPaginationRange().map((item, idx) => (
               item === '...' ? (
                  <span key={`dots-${idx}`} className={styles.dots}>…</span>
               ) : (
                  <button
                     key={item}
                     className={`${styles.pageBtn} ${page === item ? styles.active : ''}`}
                     onClick={() => handlePageChange(item as number)}
                  >
                     {item}
                  </button>
               )
            ))}

            <button
               className={styles.pageBtn}
               disabled={page === totalPages}
               onClick={() => handlePageChange(page + 1)}
               aria-label="Next page"
            >
               ›
            </button>
         </div>

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
      </>
   );
}