"use client";

import { useState, useEffect } from 'react';
import GalleryItem from './GalleryItem';
import styles from './Gallery.module.css';

interface Img { id: string | number; url: string; alt?: string }

interface Props {
   images: Img[];
   onItemLoad: (index: number) => void;
   onOpen: (index: number) => void;
   page: number;
   itemsPerPage: number;
}

export default function GalleryGrid({ images, onItemLoad, onOpen, page, itemsPerPage }: Props) {
   const [isDesktop, setIsDesktop] = useState(false);

   useEffect(() => {
      const onResize = () => setIsDesktop(window.innerWidth > 900);
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
   }, []);

   const start = (page - 1) * itemsPerPage;
   const displayImages = images.slice(start, start + itemsPerPage);

   const getAspectRatio = (localIndex: number) => {
      const total = displayImages.length;
      if (total < 8) {
         if (localIndex % 2 !== 0 && localIndex < 4) return { paddingBottom: '47%' };
      }
      return { paddingBottom: '57%' };
   };

   const getAspectRatioDesktop = (colIdx: number, rowInCol: number) => {
      const isFirstInColumn = rowInCol === 0;
      const isSecondOrFourthColumn = colIdx === 1 || colIdx === 3;
      if (isFirstInColumn && isSecondOrFourthColumn) return { paddingBottom: '46.62%' };
      return { paddingBottom: '57%' };
   };

   if (isDesktop) {
      const columnsCount = 4;
      const cols: Img[][] = Array.from({ length: columnsCount }, () => []);
      for (let i = 0; i < displayImages.length; i++) cols[i % columnsCount].push(displayImages[i]);

      return (
         <div className={styles.masonryDesktop}>
            {cols.map((colItems, colIdx) => (
               <div key={colIdx} className={styles.masonryColumn}>
                  {colItems.map((img, idx) => {
                     // compute index within current page (0-based)
                     const localIndex = colIdx + idx * columnsCount;
                     return (
                        <GalleryItem
                           key={img.id}
                           img={img}
                           index={localIndex}
                           onLoad={onItemLoad}
                           onOpen={onOpen}
                           aspectStyle={getAspectRatioDesktop(colIdx, idx)}
                        />
                     );
                  })}
               </div>
            ))}
         </div>
      );
   }

   return (
      <div className={styles.masonry}>
         {displayImages.map((img, idx) => (
            <GalleryItem
               key={img.id}
               img={img}
               index={idx}
               onLoad={onItemLoad}
               onOpen={onOpen}
               aspectStyle={getAspectRatio(idx)}
            />
         ))}
      </div>
   );
}
