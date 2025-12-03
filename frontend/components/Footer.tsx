'use client'

import { useEffect, useState } from 'react'
import styles from './Footer.module.css'
import Logo from './Logo'
import { fetchAPI } from '@/app/lib/api'

interface NavItem {
   link: string
   label: string
}

interface FooterProps {
   locale: string
}

export default function Footer({ locale }: FooterProps) {
   const [items, setItems] = useState<NavItem[]>([])

   useEffect(() => {
      let mounted = true
      async function loadNav() {
         try {
            const res = await fetchAPI('/api/navbars', locale)
            const data = res.data || []
            const localizedItems: NavItem[] = data.map((item: any) => {
               if (item.locale === locale) {
                  return { label: item.Label, link: item.Link }
               }
               const loc = item.localizations?.find((l: any) => l.locale === locale)
               return loc ? { label: loc.Label, link: loc.Link } : { label: item.Label, link: item.Link }
            })
            if (mounted) setItems(localizedItems)
         } catch (err) {
            console.error(err)
         }
      }
      loadNav()
      return () => { mounted = false }
   }, [locale])

   const year = new Date().getFullYear()

   return (
      <footer className={styles.footer}>
         <div className={styles.left}>
            <nav className={styles.links} aria-label="Footer navigation">
               {items.map(item => (
                  <a key={item.label} href={`/${locale}${item.link}`}>{item.label}</a>
               ))}
            </nav>
         </div>
         <div className={styles.right}>
            © {year} Всі права захищені
         </div>
      </footer>
   )
}
