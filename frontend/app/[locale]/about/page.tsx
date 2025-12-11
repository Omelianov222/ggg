import { fetchAPI } from '@/app/lib/api'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './About.module.css'

type Props = {
   params: Promise<{ locale: string }>
}

function resolveUrl(path?: string) {
   if (!path) return undefined
   if (path.startsWith('http')) return path
   const base = process.env.NEXT_PUBLIC_API_URL ?? ''
   return base.replace(/\/$/, '') + path
}

export default async function AboutPage({ params }: Props) {
   const { locale } = await params

   const res = await fetchAPI('/api/About-us', locale)

   const item = res?.data ?? null

   if (!item) {
      return <div style={{ padding: '2rem' }}>No content</div>
   }

   const title = item.Title ?? ''
   const paragraph = item.Paragraph ?? ''
   // prefer original (highest quality) `url` from API, then fall back to formats
   const bgRaw = item.Background?.url ?? item.Background?.formats?.large?.url ?? item.Background?.formats?.medium?.url ?? item.Background?.formats?.small?.url ?? undefined
   const bgUrl = resolveUrl(bgRaw)

   return (
      <div className={styles.hero} style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}>
         <div className={styles.overlay} />
         <div className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.panel}>
               <div className={styles.content}>
                  <ReactMarkdown>{paragraph}</ReactMarkdown>
               </div>
            </div>
         </div>
      </div>
   )
}
