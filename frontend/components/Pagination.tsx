"use client";

import styles from './Gallery.module.css';

interface Props {
   page: number;
   totalPages: number;
   onChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
   const getPaginationRange = () => {
      const delta = 2;
      const range: number[] = [];
      const rangeWithDots: (number | string)[] = [];

      for (let i = 1; i <= totalPages; i++) {
         if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) range.push(i);
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
      <div className={styles.pagination}>
         <button className={styles.pageBtn} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">‹</button>

         {getPaginationRange().map((item, idx) => (
            item === '...' ? (
               <span key={`dots-${idx}`} className={styles.dots}>…</span>
            ) : (
               <button
                  key={item}
                  className={`${styles.pageBtn} ${page === item ? styles.active : ''}`}
                  onClick={() => onChange(item as number)}
               >
                  {item}
               </button>
            )
         ))}

         <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">›</button>
      </div>
   );
}
