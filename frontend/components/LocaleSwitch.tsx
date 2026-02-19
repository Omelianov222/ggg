"use client"

import React from 'react'
import styles from './Navbar.module.css'

interface Props {
   locale: string
}

export default function LocaleSwitch({ locale }: Props) {
   const handleSwitch = () => {
      try {
         const currentPath = window.location.pathname || '/'
         const segments = currentPath.split('/').filter(Boolean)
         const other = locale === 'pl' ? 'en' : 'pl'

         const isLocaleSegment = segments[0] === 'pl' || segments[0] === 'en'
         if (isLocaleSegment) {
            segments[0] = other
         } else {
            segments.unshift(other)
         }

         const target = '/' + segments.join('/')
         window.location.href = target
      } catch (err) {
         console.error('Locale switch error', err)
      }
   }

   return (
      <div className={styles['locale-switch']}>
         <button onClick={handleSwitch} aria-label="Switch language" className={styles['locale-button']}>
            {locale === 'pl' ? 'EN' : 'PL'}
         </button>
      </div>
   )
}
