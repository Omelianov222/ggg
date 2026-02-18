import React from "react";
import styles from "./AboutUsGrid.module.css";
import ReactMarkdown from "react-markdown";


type AboutItem = {
   id: number;
   Paragraph: string;
   Photo: { url: string }[] | null;
};

type Props = {
   data: AboutItem[];
};

export default function AboutUsGrid({ data }: Props) {

   return (
      <section className={styles['about-grid']}>
         {data.map((item, index) => {
            const isEven = index % 2 === 0;
            const imageUrl = item.Photo?.[0]?.url;

            return (
               <div
                  key={item.id}
                  className={`${styles['about-row']} ${isEven ? styles['normal'] : styles['reverse']}`}
               >

                  <div className={styles['about-text']}>
                     <ReactMarkdown>{item.Paragraph}</ReactMarkdown>
                  </div>

                  {imageUrl && (
                     <div className={styles['about-image']}>
                        <img src={imageUrl} alt="" />
                     </div>
                  )}
               </div>
            );
         })}
      </section>
   );
}
