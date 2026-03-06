"use client";

import { useEffect, useState, useCallback } from 'react';
import GalleryGrid from './GalleryGrid';
import Pagination from './Pagination';
import Lightbox from './Lightbox';

interface GalleryProps {
   images: { id: string | number; url: string; alt?: string }[];
}

const ITEMS_PER_PAGE = 16;

export default function Gallery({ images }: GalleryProps) {
   const totalPages = Math.max(1, Math.ceil(images.length / ITEMS_PER_PAGE));

   const [page, setPage] = useState(1);
   const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set());

   const [currentIndex, setCurrentIndex] = useState<number | null>(null);

   useEffect(() => {
      // ensure current page is valid when images change and clear loaded items
      const newTotal = Math.max(1, Math.ceil(images.length / ITEMS_PER_PAGE));
      const t = setTimeout(() => {
         setPage(prev => Math.min(Math.max(1, prev), newTotal));
         setLoadedItems(new Set());
      }, 0);
      return () => clearTimeout(t);
   }, [images]);

   const handlePageChange = (newPage: number) => {
      setLoadedItems(new Set());
      setPage(newPage);
   };

   const handleItemLoad = useCallback((index: number) => {
      setLoadedItems(prev => {
         const next = new Set(prev);
         next.add(index);
         return next;
      });
   }, []);

   useEffect(() => {
      // no-op: we keep loadedItems for potential UI hooks, derivations can be added later
   }, [loadedItems, page, images.length]);

   const openAt = (indexInPage: number) => {
      setCurrentIndex((page - 1) * ITEMS_PER_PAGE + indexInPage);
   };

   const close = () => setCurrentIndex(null);

   const showNext = useCallback(() => setCurrentIndex(ci => (ci === null ? null : (ci + 1) % images.length)), [images.length]);
   const showPrev = useCallback(() => setCurrentIndex(ci => (ci === null ? null : (ci - 1 + images.length) % images.length)), [images.length]);

   return (
      <>
         <GalleryGrid images={images} onItemLoad={handleItemLoad} onOpen={openAt} page={page} itemsPerPage={ITEMS_PER_PAGE} />

         <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />

         <Lightbox images={images} currentIndex={currentIndex} onClose={close} onNext={showNext} onPrev={showPrev} />
      </>
   );
}