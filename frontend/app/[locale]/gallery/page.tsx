import { fetchAPI } from "@/app/lib/api";
import { Suspense } from "react";
import GalleryClient from "./GalleryClient";

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

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;

   const data = await fetchAPI("/api/galleries", locale);

   if (!data?.data?.length) {
      return <div>No gallery found</div>;
   }

   const galleries = data.data as GalleryType[];
   const categories = Array.from(new Set(galleries.map((g: GalleryType) => g.Category).filter(Boolean))) as string[];

   return (
      <Suspense>
         <GalleryClient locale={locale} galleries={galleries} categories={categories} />
      </Suspense>
   );
}
