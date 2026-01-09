// ContactForm.jsx
'use client'
import styles from './ContactForm.module.css';

export default function ContactForm() {
   const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission
   };

   return (
      <section className={styles.contact}>
         <div className={styles.container}>
            <h2 className={styles.title}>HAVE A QUESTION?</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
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

               <button type="submit" className={styles.button}>
                  Send
               </button>
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
      </section>
   );
}