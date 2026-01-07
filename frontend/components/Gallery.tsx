'use client';

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

interface GalleryProps {
   images: { id: string | number; url: string; alt?: string }[];
}

export default function Gallery({ images }: GalleryProps) {
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

   return (
      <div className={styles.masonry}>
         {images.map((img, index) => {
            // Кожне друге зображення (непарні індекси: 1, 3, 5...)
            const shouldCrop = index % 2 === 1;

            return (
               <div
                  key={index}
                  className={`${styles['masonry-item']} ${loadedItems.has(index) ? styles.loaded : ''} ${shouldCrop ? styles.cropped : ''}`}
                  onClick={() => openAt(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') openAt(index);
                  }}
               >
                  <div
                     style={shouldCrop ? {
                        width: '100%',
                        paddingBottom: '56.25%', // 16:9 = 9/16 = 0.5625 = 56.25%
                        position: 'relative',
                        overflow: 'hidden'
                     } : {}}
                  >
                     <Image
                        src={img.url}
                        alt={img.alt || "Gallery image"}
                        width={500}
                        height={500}
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 25vw"
                        style={shouldCrop ? {
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
