'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './LogoFixed.module.css'

export default function LogoFixed() {
   const logoFixedRef = useRef<HTMLDivElement>(null)
   const pathname = usePathname()

   const isHome =
      pathname === '/' ||
      /^\/[a-z]{2}$/.test(pathname) ||
      /^\/[a-z]{2}\/$/.test(pathname)


   useEffect(() => {
      if (logoFixedRef.current) {
         setTimeout(() => {
            logoFixedRef.current.style.display = 'flex'
            logoFixedRef.current.style.opacity = '1'
            logoFixedRef.current.style.transition = '1s'
         }, 1100)
      }
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
         <div className={styles['logo-fixed']} ref={logoFixedRef}>
            <div className={styles['logo-flip-fixed']}>
               <img className={styles['logo-main']} src="/logo3.svg" alt="Logo" />
               <img className={styles['logo-hover']} src="/ecoLogo.png" alt="Eco Logo" />
            </div>
         </div>
      </Link>
   )
}
