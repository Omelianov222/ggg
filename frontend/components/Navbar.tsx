'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css'
import { fetchAPI } from '@/app/lib/api'
import Logo from './Logo'
import LocaleSwitch from './LocaleSwitch'

interface NavItem {
   link: string
   label: string
   id?: string
}

interface NavbarProps {
   locale: string
}

// Простий кеш для навігації по локалі
const navCache: Record<string, NavItem[]> = {}

export default function Navbar({ locale }: NavbarProps) {
   const [items, setItems] = useState<NavItem[]>([])
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const [isHovered, setIsHovered] = useState(false)
   const navbarRef = useRef<HTMLElement>(null)
   const timeoutRef = useRef<NodeJS.Timeout | null>(null)

   useEffect(() => {
      async function loadNav() {
         try {
            if (navCache[locale]) {
               setItems(navCache[locale])
               return
            }

            console.time('myBenchmark')
            const res = await fetchAPI('/api/navbars', locale)
            console.timeEnd('myBenchmark')
            const data = res.data || []

            const localizedItems: NavItem[] = data.map((item: any) => {
               if (item.locale === locale) {
                  return { label: item.Label, link: item.Link }
               }
               const loc = item.localizations?.find((l: any) => l.locale === locale)
               return loc ? { label: loc.Label, link: loc.Link } : { label: item.Label, link: item.Link }
            })

            // Зберігаємо у кеш
            navCache[locale] = localizedItems
            setItems(localizedItems)

            setTimeout(() => {
               if (navbarRef.current) {
                  navbarRef.current.style.opacity = "1"
                  navbarRef.current.style.pointerEvents = "auto"
                  const liItems = navbarRef.current.querySelectorAll("li")
                  liItems.forEach((li, i) => {
                     setTimeout(() => {
                        const el = li as HTMLElement
                        el.getBoundingClientRect()
                        el.style.opacity = "1"
                        el.style.transform = "translateX(0)"
                     }, 100 * i)
                  })
               }
            }, 50)
         } catch (err) {
            console.error(err)
         }
      }
      loadNav()
   }, [locale])

   const handleMouseEnter = () => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current)
      }
      setIsHovered(true)
   }

   const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
         setIsHovered(false)
      }, 200)
   }

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
   }

   const closeMenu = () => {
      setIsMenuOpen(false)
   }

   return (
      <nav
         className={styles['main-navbar']}
         ref={navbarRef}
         style={{ opacity: 0, pointerEvents: 'none' }}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         <div className={styles['logo-container']}>
            <Logo />
         </div>

         <div className={`${styles['navbar-dropdown']} ${isHovered ? styles['dropdown-visible'] : ''}`}>
            <ul className={styles['nav-menu']}>
               {items.map(item => (
                  <li
                     key={item.label}
                     style={{ opacity: 0, transform: 'translateX(-40px)', transition: 'opacity .5s, transform .5s' }}
                     onClick={closeMenu}
                  >
                     <a href={`/${locale}${item.link}`}>{item.label}</a>
                  </li>
               ))}
            </ul>
            <LocaleSwitch locale={locale} />
         </div>

         {/* Мобільна версія */}
         <button
            className={`${styles['burger-button']} ${isMenuOpen ? styles['burger-open'] : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
         >
            <span></span>
            <span></span>
            <span></span>
         </button>

         <ul className={`${styles['nav-menu-mobile']} ${isMenuOpen ? styles['menu-open'] : ''}`}>
            {items.map(item => (
               <li
                  key={item.label}
                  onClick={closeMenu}
               >
                  <a href={`/${locale}${item.link}`}>{item.label}</a>
               </li>
            ))}
         </ul>

         <div className={styles['locale-switch-mobile']}>
            <LocaleSwitch locale={locale} />
         </div>

         {isMenuOpen && <div className={styles['overlay']} onClick={closeMenu}></div>}
      </nav>
   )
}