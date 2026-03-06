"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css';

interface Props {
   images: { id: string | number; url: string; alt?: string }[];
   currentIndex: number | null;
   onClose: () => void;
   onNext: () => void;
   onPrev: () => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: Props) {
   useEffect(() => {
      if (currentIndex === null) return;
      const onKey = (e: KeyboardEvent) => {
         if (e.key === 'Escape') onClose();
         if (e.key === 'ArrowRight') onNext();
         if (e.key === 'ArrowLeft') onPrev();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
   }, [currentIndex, onClose, onNext, onPrev]);

   if (currentIndex === null) return null;

   const img = images[currentIndex];

   return (
      <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
         <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
            <button className={styles.prevBtn} onClick={onPrev} aria-label="Previous">‹</button>
            <div className={styles.modalImageWrapper}>
               <Image src={img.url} alt={img.alt || 'Gallery image'} width={1200} height={800} style={{ width: '100%', height: 'auto' }} />
            </div>
            <button className={styles.nextBtn} onClick={onNext} aria-label="Next">›</button>
         </div>
      </div>
   );
}
