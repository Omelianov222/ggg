import { fetchAPI } from "@/app/lib/api";
import Gallery from "@/components/Gallery";
import Link from "next/link";
import styles from "@/components/Gallery.module.css";
interface Props {
   params: Promise<{ locale: string }>;
   searchParams?: { [key: string]: string | string[] | undefined };
}

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

export default async function GalleryPage({ params, searchParams }: Props) {
   const { locale } = await params;

   const data = await fetchAPI("/api/galleries", locale);

   if (!data || !data.data || !data.data.length) {
      return <div>No gallery found</div>;
   }

   // Build categories from returned galleries
   const galleries = data.data as GalleryType[];
   const categories = Array.from(new Set(galleries.map(g => g.Category).filter(Boolean))) as string[];

   // `searchParams` may be a Promise in Next.js — await/unpack it before use
   const _searchParams = (await searchParams) as { [key: string]: string | string[] | undefined } | undefined;
   const selectedCategory = typeof _searchParams?.category === 'string' ? _searchParams.category : 'All';

   // Determine images to show: if 'All' -> concat all Images, else find gallery with matching category
   let images: MediaItem[] = [];
   if (selectedCategory === 'All') {
      images = galleries.flatMap(g => g.Images || []);
   } else {
      const found = galleries.find(g => g.Category === selectedCategory);
      images = found ? (found.Images || []) : [];
   }

   // Simple UI: category links with animated styles
   return (
      <div style={{ marginTop: 'var(--header-height)' }}>
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
            <Gallery images={images.map((img) => ({ id: img.id, url: img.url, alt: img.alternativeText || img.name || '' }))} />
         )}
      </div>
   );
}
