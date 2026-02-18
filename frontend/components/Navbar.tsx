'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css'
// ...existing code... (removed unused import)
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


// Простий кеш для навігації по локалі (removed unused cache)

export default function Navbar({ locale, initialItems }: NavbarProps) {
   const [items] = useState<NavItem[]>(initialItems)
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const [isHovered, setIsHovered] = useState(false)
   // Start hidden to match server render. Decide visibility on mount to avoid hydration mismatch.
   const [visible, setVisible] = useState<boolean>(false)

   const navbarRef = useRef<HTMLElement>(null)
   const timeoutRef = useRef<NodeJS.Timeout | null>(null)
   const isInitialRender = useRef(true)
   useEffect(() => {
      if (!items.length || !navbarRef.current) return

      const liItems = navbarRef.current.querySelectorAll('li')

      // ПЕРШИЙ РЕНДЕР — without animation. If navbar isn't visible yet, skip animating until visible.
      if (isInitialRender.current) {
         if (!visible) return

         liItems.forEach((li, i) => {
            setTimeout(() => {
               const el = li as HTMLElement
               el.style.opacity = '1'
               el.style.transform = 'translateX(0)'
            }, 300 * i)
         })

         isInitialRender.current = false
         return
      }
   }, [items, visible])

   // On mount: reveal navbar immediately on non-main pages or if intro already finished.
   // Also listen for global introFinished event to reveal navbar later.
   useEffect(() => {
      const onIntro = () => setVisible(true)

      const w = window as Window & { __introFinished?: boolean }
      const pathname = window.location.pathname
      const isMain = pathname === `/${locale}` || pathname === `/${locale}/`

      if (w.__introFinished === true || !isMain) {
         // schedule state update to avoid synchronous setState inside effect
         requestAnimationFrame(() => setVisible(true))
      }

      window.addEventListener('introFinished', onIntro)
      return () => window.removeEventListener('introFinished', onIntro)
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
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
         style={{
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'auto' : 'none',
            transition: 'opacity 600ms ease',
         }}
      >
         <div style={{ display: "flex", alignItems: "center", position: "relative", gap: "30px" }}>
            <div style={{ minHeight: "100%", }} className={styles['logo-wrapper']}>
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

         </div>

         {isMenuOpen && <div className={styles['overlay']} onClick={closeMenu}></div>}
      </nav>
   )
}