'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './LogoFixed.module.css'

// Сторінки, на яких логотип має бути сірим
const PAGES_WITH_GRAY_LOGO = ['dealers']

export default function LogoFixed() {
   const logoFixedRef = useRef<HTMLDivElement>(null)
   const pathname = usePathname()

   const isHome =
      pathname === '/' ||
      /^\/[a-z]{2}$/.test(pathname) ||
      /^\/[a-z]{2}\/$/.test(pathname)

   // Перевіряємо, чи знаходимось на сторінці, де логотип має бути сірим
   const shouldGrayLogo = PAGES_WITH_GRAY_LOGO.some(page =>
      pathname.includes(`/${page}`)
   )


   useEffect(() => {
      const el = logoFixedRef.current
      if (!el) return

      setTimeout(() => {
         el.style.display = 'flex'
         el.style.opacity = '1'
         el.style.transition = '1s'
      }, 1100)
   }, [])



   return (
      <Link
         href="/"
         onClick={(e) => {
            console.log(pathname)
            if (isHome) e.preventDefault()
         }}
         aria-current={isHome ? 'page' : undefined}
      >
         <div
            className={styles['logo-fixed']}
            ref={logoFixedRef}

         >
            <div style={{
               width: '100%',
               height: '100%',
               filter: shouldGrayLogo ? 'invert(0.5)' : undefined
            }}>
               <div className={styles['logo-flip-fixed']}>

                  <img className={styles['logo-main']} src="/logo3.svg" alt="Logo" />

                  <img className={styles['logo-hover']} src="/ecoLogo.png" alt="Eco Logo" />

               </div>
            </div>
         </div>
      </Link>
   )
}
