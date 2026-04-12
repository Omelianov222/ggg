import styles from './Footer.module.css'
import Logo from './Logo'
import Image from 'next/image'
import type { NavItem, SocialItem } from '@/app/lib/api'

interface FooterProps {
   locale: string
   navItems: NavItem[]
   socials: SocialItem[]
}

const COPYRIGHT_TEXT: Record<string, string> = {
   en: "All rights reserved",
   uk: "Всі права захищені",
   fr: "Tous droits réservés",
};

export default function Footer({ locale, navItems, socials }: FooterProps) {
   const year = new Date().getFullYear()

   return (
      <footer className={styles.footer}>
         <div className={styles.container}>
            <div className={styles.col}>
               <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                  <div style={{ flex: "0 0 30%", minHeight: "100%" }}>
                     <Logo disableInvert />
                  </div>
                  <div style={{ flex: "0 0 70%" }}>
                     <Image src="/GELEX-GLOBAL-GROUP-LOGO.png" alt="GELEX" objectFit="cover" width={125} height={64} style={{ height: "auto" }} />
                  </div>
               </div>
               <p className={styles.description}>
                  {locale === 'uk'
                     ? 'Місце для короткого опису компанії.'
                     : 'GALA boats have been produced since 2015 and represent a combination of aesthetics, comfort, and unique technologies, providing excellent maneuverability, high-speed performance, and safety'}
               </p>
            </div>

            <div className={styles.col}>
               <nav className={styles.links} aria-label="Footer navigation">
                  {navItems.map(item => (
                     <a key={item.label} href={`/${locale}${item.link}`}>{item.label}</a>
                  ))}
               </nav>
            </div>

            <div className={styles.col}>
               <h4 className={styles.heading}>Social</h4>
               <div className={styles.social}>
                  {socials.map(s => {
                     const name = (s.SocialName || '').toLowerCase()
                     const href = s.link || '#'
                     const isEmail = name === 'gmail' || href.includes('@')
                     const props = isEmail
                        ? { href: `mailto:${href}`, 'aria-label': s.SocialName || 'social', className: styles.socialLink }
                        : { href, target: '_blank', rel: 'noreferrer', 'aria-label': s.SocialName || 'social', className: styles.socialLink }

                     return (
                        <a key={s.id} {...props}>
                           {name.includes('facebook') && (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                 <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.88v-6.99H8.02v-2.89h2.28V9.41c0-2.26 1.34-3.5 3.39-3.5.98 0 2.01.18 2.01.18v2.21h-1.13c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.89h-2.1V22c4.78-.75 8.44-4.89 8.44-9.93z" />
                              </svg>
                           )}
                           {name.includes('instagram') && (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                 <rect x="3" y="3" width="18" height="18" rx="5" />
                                 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                 <path d="M17.5 6.5h.01" />
                              </svg>
                           )}
                           {name.includes('youtube') && (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                 <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.58 3.5 12 3.5 12 3.5s-7.58 0-9.38.58A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12C4.42 20.5 12 20.5 12 20.5s7.58 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.9 31.9 0 0 0 24 12a31.9 31.9 0 0 0-.5-5.8zM10 15.5v-7l6 3.5-6 3.5z" />
                              </svg>
                           )}
                           {name.includes('gmail') && (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                 <path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8" />
                                 <path d="M21 7l-9 7-9-7" />
                                 <path d="M3 7h18" />
                              </svg>
                           )}
                        </a>
                     )
                  })}
               </div>
            </div>
            <div className={styles.copyright}>
               {year} {COPYRIGHT_TEXT[locale] ?? COPYRIGHT_TEXT.en}
            </div>
         </div>
      </footer>
   )
}
