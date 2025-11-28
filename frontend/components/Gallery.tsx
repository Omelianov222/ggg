import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Gallery({ images }: { images: any[] }) {
   return (
      <div className="masonry">
         {images.map(img => {
            const url = img.url;

            return (
               <div key={img.id} className="masonry-item">
                  <Image
                     src={url.startsWith("http") ? url : API_URL + url}
                     alt={img.name ?? ""}
                     width={600}
                     height={600}
                     style={{ width: "100%", height: "auto" }}
                  />
               </div>
            );
         })}
      </div>
   );
}
