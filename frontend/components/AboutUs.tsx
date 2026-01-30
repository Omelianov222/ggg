import { fetchAPI } from '@/app/lib/api'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './AboutUs.module.css'
import { SectionHeader } from './UI/SectionHeader'

type Props = {
   locale: string
}

function resolveUrl(path?: string) {
   if (!path) return undefined
   if (path.startsWith('http')) return path
   const base = process.env.NEXT_PUBLIC_API_URL ?? ''
   return base.replace(/\/$/, '') + path
}

export default async function AboutUs(params: Props) {

   const { locale } = await params
   const res = await fetchAPI('/api/about-us-content', locale)

   const item = res?.data ?? null

   if (!item) {
      return <div style={{ padding: '2rem' }}>No content</div>
   }


   const paragraph = item.MainPageText ?? ''

   return (
      <div className={styles.hero} >
         <div className={styles.overlay} />
         <div className={styles.container}>
            <SectionHeader title="About Us" />
            <div className={styles.panel}>
               <div className={styles.content}>
                  <ReactMarkdown>{paragraph}</ReactMarkdown>
               </div>
            </div>

         </div>
      </div>
   )
}


