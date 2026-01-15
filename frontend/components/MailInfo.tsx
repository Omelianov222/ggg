import styles from './FamilyBrand.module.css';
export default function MailInfo() {
   return (
      <>
         <section className={styles.contact}>
            <h2>
               DO YOU HAVE QUESTIONS?
               <br />
               DO NOT WAIT, CONTACT US!
            </h2>

            <p>NEED LEASING ADVICE? OUR TEAM OF LEASING ADVISORS IS HERE TO HELP.</p>

            <div className={styles.emails}>
               <a href="mailto:office@gelexglobal.com">office@gelexglobal.com</a>
               <a href="mailto:pr@gelexglobal.com">pr@gelexglobal.com</a>
            </div>
         </section >
      </>
   )
}
