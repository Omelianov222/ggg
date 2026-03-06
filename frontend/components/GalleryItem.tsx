"use client";

import Image from "next/image";
import styles from "./Gallery.module.css";

interface Props {
   img: { id: string | number; url: string; alt?: string };
   index: number; // index within current page
   onLoad: (index: number) => void;
   onOpen: (index: number) => void;
   aspectStyle: React.CSSProperties;
}

export default function GalleryItem({ img, index, onLoad, onOpen, aspectStyle }: Props) {
   return (
      <div
         className={`${styles['masonry-item']}`}
         onClick={() => onOpen(index)}
         role="button"
         tabIndex={0}
         onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onOpen(index);
         }}
      >
         <div style={{ ...aspectStyle, position: 'relative', overflow: 'hidden' }}>
            <Image
               src={img.url}
               alt={img.alt || 'Gallery image'}
               fill
               sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 25vw"
               style={{ objectFit: 'cover', cursor: 'zoom-in' }}
               placeholder="blur"
               blurDataURL="/placeholder.png"
               onLoad={() => onLoad(index)}
            />
         </div>
      </div>
   );
}
