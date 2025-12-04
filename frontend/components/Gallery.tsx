'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

interface GalleryProps {
   images: { id: string | number; url: string; alt?: string }[];
}

export default function Gallery({ images }: GalleryProps) {
   const [loadedItems, setLoadedItems] = useState<Set<number>>(new Set());

   const handleLoad = (index: number) => {
      setLoadedItems(prev => new Set(prev).add(index));
   };

   return (
      <div className={styles.masonry}>
         {images.map((img, index) => (
            <div
               key={img.id}
               className={`${styles['masonry-item']} ${loadedItems.has(index) ? styles.loaded : ''
                  }`}
            >
               <Image
                  src={img.url}
                  alt={img.alt || "Gallery image"}
                  width={500}
                  height={500}
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 25vw"
                  style={{ width: "100%", height: "auto" }}
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
                  onLoad={() => handleLoad(index)} // <-- замість onLoadingComplete
               />

            </div>
         ))}
      </div>
   );
}
