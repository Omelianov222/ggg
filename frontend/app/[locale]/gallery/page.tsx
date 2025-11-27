import { fetchAPI } from "@/app/lib/api";
import Gallery from "@/components/Gallery";

export default async function GalleryPage({ params }: { params: { locale: string } }) {
   const { locale } = await params;
   const data = await fetchAPI("/api/galleries", locale);

   const images = data.data.attributes.images.data;
   console.log("DATAAAAAAAAAAAAAAA", data);
   return <Gallery images={images} />;
}
