// ContactForm.jsx
'use client'
import Page from '@/app/[locale]/homePage2/page';
import styles from './ContactForm.module.css';
import { PageHeader } from './UI/PageHeader';

export default function ContactForm() {
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Handle form submission
   };

   return (
      <section className={styles.contact}>
         <div className={styles.container}>
            <PageHeader title="HAVE A QUESTION?" />

            <div className={styles.contactContainer}>
               <form className={styles.form} onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <input
                        type="email"
                        placeholder="Your e-mail"
                        className={styles.input}
                        required
                     />

                     <input
                        type="text"
                        placeholder="Your Name"
                        className={styles.input}
                        required
                     />

                     <textarea
                        placeholder="Your message"
                        className={styles.textarea}
                        rows={1}
                        required
                     />

                  </div>

                  <div style={{
                     display: 'flex', justifyContent: 'center', flex: "1 1 100%", margin: " 50px 0px"
                  }}>

                     <button type="submit" className={styles.button
                     } >
                        Send
                     </button>
                  </div>
               </form>

               <div className={styles.contactInfo}>
                  <h3 className={styles.contactTitle}>CONTACT US</h3>
                  <a href="mailto:office@gelexglobal.com" className={styles.email}>
                     office@gelexglobal.com
                  </a>
                  <a href="mailto:pr@gelexglobal.com" className={styles.email}>
                     pr@gelexglobal.com
                  </a>
               </div>
            </div>

         </div >
      </section >
   );
}