'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css'
import { fetchAPI } from '@/app/lib/api'
import Logo from './Logo'
import LocaleSwitch from './LocaleSwitch'

interface NavItem {
   link: string
   label: string
   id: string
}

interface NavbarProps {
   locale: string
}

export default function Navbar({ locale }: NavbarProps) {
   const [items, setItems] = useState<NavItem[]>([])
   const navbarRef = useRef<HTMLElement>(null)

   useEffect(() => {
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

            setItems(localizedItems)

            // Анімація після рендеру
            setTimeout(() => {
               if (navbarRef.current) {
                  navbarRef.current.style.opacity = "1";
                  navbarRef.current.style.pointerEvents = "auto";
                  const liItems = navbarRef.current.querySelectorAll("li");
                  liItems.forEach((li, i) => {
                     setTimeout(() => {
                        const el = li as HTMLElement;
                        // force browser to apply initial styles
                        el.getBoundingClientRect();
                        el.style.opacity = "1";
                        el.style.transform = "translateX(0)";
                     }, 200 * i);
                  });
               }
            }, 50)

         } catch (err) {
            console.error(err)
         }
      }

      loadNav()
   }, [locale])

   return (
      <nav className={styles['main-navbar']} ref={navbarRef} style={{ opacity: 0, pointerEvents: 'none' }}>
         <Logo />
         <LocaleSwitch locale={locale} />
         <ul>
            {items.map(item => (
               <li key={item.label} style={{ opacity: 0, transform: 'translateX(-40px)', transition: 'opacity .5s, transform .5s' }}>
                  <a href={`/${locale}${item.link}`}>{item.label}</a>
               </li>
            ))}
         </ul>
      </nav>
   )
}



