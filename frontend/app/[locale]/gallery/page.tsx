import { fetchAPI } from "@/app/lib/api";
import Gallery from "@/components/Gallery";

export default async function GalleryPage({ params }: { params: { locale: string } }) {
   const { locale } = await params;

   const data = await fetchAPI("/api/galleries", locale);

   if (!data?.data?.length) {
      return <div>No gallery found</div>;
   }

   const images = data.data[0].Images;

   return <Gallery images={images} />;
}
