'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './LogoFixed.module.css'

const PAGES_WITH_GRAY_LOGO = ['dealers']

type Props = {
   disableInvert?: boolean
}

export default function LogoFixed({ disableInvert = false }: Props) {
   const logoFixedRef = useRef<HTMLDivElement>(null)
   const pathname = usePathname()

   const isHome =
      pathname === '/' ||
      /^\/[a-z]{2}$/.test(pathname) ||
      /^\/[a-z]{2}\/$/.test(pathname)

   const shouldGrayLogo = PAGES_WITH_GRAY_LOGO.some(page =>
      pathname.includes(`/${page}`)
   )

   const shouldInvert = shouldGrayLogo && !disableInvert

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
            if (isHome) e.preventDefault()
         }}
         aria-current={isHome ? 'page' : undefined}
      >
         <div
            className={styles['logo-fixed']}
            ref={logoFixedRef}
         >
            <div
               className={styles['logo-wrapper']}
               style={{
                  width: '100%',
                  height: '100%',
                  filter: shouldInvert ? 'invert(0.5)' : undefined
               }}
            >
               <div className={styles['logo-flip-fixed']}>
                  <img className={styles['logo-main']} src="/logo3.svg" alt="Logo" />
                  <img className={styles['logo-hover']} src="/ecoLogo.png" alt="Eco Logo" />
               </div>
            </div>
         </div>
      </Link>
   )
}