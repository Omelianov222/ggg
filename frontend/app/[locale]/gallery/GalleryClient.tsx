'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Gallery from '@/components/Gallery';
import FamilyBrand from '@/components/FamilyBrand';
import { PageHeader } from '@/components/UI/PageHeader';
import styles from '@/components/Gallery.module.css';

type MediaItem = {
   id: number | string;
   url: string;
   alternativeText?: string | null;
   name?: string | null;
};

type GalleryType = {
   id: number | string;
   Category?: string | null;
   Images?: MediaItem[];
};

interface Props {
   locale: string;
   galleries: GalleryType[];
   categories: string[];
}

export default function GalleryClient({ locale, galleries, categories }: Props) {
   const searchParams = useSearchParams();
   const selectedCategory = searchParams.get('category') ?? 'All';

   let images: MediaItem[] = [];
   if (selectedCategory === 'All') {
      images = galleries.flatMap(g => g.Images || []);
   } else {
      const found = galleries.find(g => g.Category === selectedCategory);
      images = found ? (found.Images || []) : [];
   }

   return (
      <div>
         <PageHeader title="Gallery" />
         <div className={styles.categoriesRow}>
            <Link
               href={`/${locale}/gallery`}
               className={`${styles.categoryLink} ${selectedCategory === 'All' ? styles.active : ''}`}
            >
               All
            </Link>
            {categories.map(cat => (
               <Link
                  key={cat}
                  href={{ pathname: `/${locale}/gallery`, query: { category: cat } }}
                  className={`${styles.categoryLink} ${selectedCategory === cat ? styles.active : ''}`}
               >
                  {cat}
               </Link>
            ))}
         </div>

         {images.length === 0 ? (
            <div style={{ padding: '0 1rem' }}>No images for this category</div>
         ) : (
            <Gallery images={images.map(img => ({ id: img.id, url: img.url, alt: img.alternativeText || img.name || '' }))} />
         )}
         <FamilyBrand />
      </div>
   );
}
