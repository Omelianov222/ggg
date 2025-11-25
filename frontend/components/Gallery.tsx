import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Gallery({ images }: { images: any[] }) {
   return (
      <div>
         {images.map(img => {
            const url = img.attributes.url;
            return <Image key={img.id} src={API_URL + url} />;
         })}
      </div>
   );
}
