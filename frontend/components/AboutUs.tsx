"use client";
import React, { useEffect, useState } from "react";
import styles from "./AboutUs.module.css";
import ReactMarkdown from "react-markdown";
import Image from 'next/image';
import Link from 'next/link';
import { fetchAPI } from '@/app/lib/api';

type AboutUsProps = {
   title?: string;
   content?: string;
   locale: string;
};

export default function AboutUs({ title, content, locale }: AboutUsProps) {

   const [data, setData] = useState<{ Title?: string; Paragraph?: string } | null>(null);

   useEffect(() => {


      (async () => {
         const res = await fetchAPI('/api/About-us', locale);
         setData({ Title: res?.data?.Title, Paragraph: res?.data?.Paragraph });
      })();

      return () => { };
   }, []);

   return (
      <section className={styles.about} aria-labelledby="about-title">
         <div className={styles.container}>


            <div className={styles.text}>
               <h2 id="about-title" className={styles.title}>
                  {data?.Title ?? title ?? (locale === 'uk' ? 'Про нас' : 'About Us')}
               </h2>

               <div className={styles.content}>
                  <ReactMarkdown>{data?.Paragraph ?? ""}</ReactMarkdown>
               </div>

               <div className={styles.content}>
                  <ReactMarkdown>{content}</ReactMarkdown>
               </div>

               <div style={{ marginTop: '1rem' }}>
                  <Link href={`/${locale}/about`} className={styles.ctaButton}>
                     More info
                  </Link>
               </div>
            </div>
         </div>
      </section>
   );
}
