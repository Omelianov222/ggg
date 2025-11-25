import { fetchAPI } from "@/app/lib/api";
import Gallery from "@/components/Gallery";

export default async function GalleryPage({ params }: { params: { locale: string } }) {
   const data = await fetchAPI("/api/gallery", params.locale);

   const images = data.data.attributes.images.data;

   return <Gallery images={images} />;
}
