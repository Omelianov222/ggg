'use client'

import { useEffect, useRef } from 'react'
import styles from './LogoFixed.module.css'

export default function LogoFixed() {
   const logoFixedRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      // Плавне появлення логотипу
      if (logoFixedRef.current) {
         setTimeout(() => {
            logoFixedRef.current!.style.display = 'flex'
            logoFixedRef.current!.style.opacity = '1'
            logoFixedRef.current!.style.transition = "1s"
         }, 1100) // невелика затримка після mount
      }
   }, [])

   return (
      <div className={styles['logo-fixed']} ref={logoFixedRef}>
         <div className={styles['logo-flip-fixed']}>
            <img className={styles['logo-main']} src="/logo3.svg" alt="Logo" />
            <img className={styles['logo-hover']} src="/ecoLogo.png" alt="Eco Logo" />
         </div>
      </div>
   )
}
