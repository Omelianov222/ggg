"use client";
import React from "react";
import styles from "./AboutUs.module.css";
import ReactMarkdown from "react-markdown";

type AboutUsProps = {
   title?: string;
   subtitle?: string;
   content?: string;
};

export default function AboutUs({ title, subtitle, content }: AboutUsProps) {
   const imageUrl =
      "https://res.cloudinary.com/dopkzbxj2/image/upload/v1764851157/large_GALA_inflatable_boats_Home_6_ba2af905aa.jpg";

   return (
      <section className={styles.about} aria-labelledby="about-title">
         <div className={styles.container}>
            <div className={styles.imageWrap}>
               <img className={styles.image} src={imageUrl} alt={title ?? "Про нас"} />
            </div>

            <div className={styles.text}>
               <h2 id="about-title" className={styles.title}>
                  {title ?? "Про нас"}
               </h2>
               {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
               {content ? (
                  <div className={styles.content}>
                     <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
               ) : (
                  <p className={styles.content}>
                     Ми — команда, спрямована на створення сталих рішень і екологічних
                     продуктів. Наша місія — робити життя кращим через відповідальний
                     підхід до виробництва і підтримки спільнот.
                  </p>
               )}
            </div>
         </div>
      </section>
   );
}
