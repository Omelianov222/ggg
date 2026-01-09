import Image from 'next/image';
import styles from './FamilyBrand.module.css';

export default function FamilyBrand() {
   const brands = [

      { name: 'GALA', desc: 'comfortable RIB boats designed for leisure' },
      { name: 'GALAXY', desc: 'professional-grade boats' },
      { name: 'GELEX', desc: 'versatile, multi-functional boats' }
   ];

   return (
      <>
         <section className={styles.brands}>
            <h2>OUR BRAND FAMILY</h2>
            <p className={styles.subtitle}>The GELEX GLOBAL GROUP factory produces boats under three brands</p>

            <div className={styles.grid}>
               <div className={`${styles.card} ${styles.main}`}>
                  <Image src={`/GELEX-GLOBAL-GROUP-LOGO.png`} alt={`GELEX`} objectFit="cover" width={250} height={200} style={{ height: "auto" }} />
               </div>

               {brands.map(b => (
                  <div key={b.name} className={styles.card}>
                     <div className={styles.logoWrapper}>
                        <Image
                           src={`/${b.name}.png`}
                           alt={b.name}
                           width={150}
                           height={200}
                           style={{ height: "auto", objectFit: "contain" }}
                        />
                     </div>
                     <div className={styles.textWrapper} >
                        <strong>{b.name}</strong>
                        <p>{b.desc}</p>
                     </div>

                  </div>
               ))}

            </div>
         </section>

         <section className={styles.contact}>
            <h2>DO YOU HAVE QUESTIONS?<br />DO NOT WAIT, CONTACT US!</h2>
            <p>NEED LEASING ADVICE? OUR TEAM OF LEASING ADVISORS IS HERE TO HELP.</p>

            <div className={styles.emails}>
               <a href="mailto:office@gelexglobal.com">📧 office@gelexglobal.com</a>
               <a href="mailto:pr@gelexglobal.com">📧 pr@gelexglobal.com</a>
            </div>
         </section>


      </>
   );
}