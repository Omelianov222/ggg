import styles from "./AboutUsGrid.module.css";


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
                     {item.Paragraph.split("\n").map((line, i) =>
                        line.startsWith("###") ? (
                           <h3 key={i}>{line.replace("###", "").trim()}</h3>
                        ) : (
                           <p key={i}>{line}</p>
                        )
                     )}
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
