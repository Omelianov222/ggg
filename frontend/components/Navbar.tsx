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
   initialItems: NavItem[]
}


// Простий кеш для навігації по локалі
const navCache: Record<string, NavItem[]> = {}

export default function Navbar({ locale, initialItems }: NavbarProps) {
   const [items, setItems] = useState<NavItem[]>(initialItems)
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const [isHovered, setIsHovered] = useState(false)
   const navbarRef = useRef<HTMLElement>(null)
   const timeoutRef = useRef<NodeJS.Timeout | null>(null)
   const isInitialRender = useRef(true)
   useEffect(() => {
      if (!items.length || !navbarRef.current) return

      const liItems = navbarRef.current.querySelectorAll('li')

      // ПЕРШИЙ РЕНДЕР — без анімації
      if (isInitialRender.current) {
         liItems.forEach((li, i) => {
            setTimeout(() => {
               const el = li as HTMLElement
               el.style.opacity = '1'
               el.style.transform = 'translateX(0)'
            }, 100 * i)
         })

         isInitialRender.current = false
         return
      }
   }, [items])


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
         // style={{ opacity: 0, pointerEvents: 'none' }}
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