import { fetchAPI } from '@/app/lib/api'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './About.module.css'
import { PageHeader } from '@/components/UI/PageHeader'
import AboutUsGrid from '@/components/AboutUsGrid'

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

   const aboutUsGridResponse = await fetchAPI('/api/about-us-sections?fields[0]=Paragraph&populate[Photo][fields][0]=url', locale)
   const aboutUsTextResponse = await fetchAPI('/api/About-us', locale)

   const aboutUsGrid = aboutUsGridResponse?.data ?? null
   const aboutUsText = aboutUsTextResponse?.data ?? null
   console.log("ITEMMMM", aboutUsText)
   if (!aboutUsGrid) {
      return <div style={{ padding: '2rem' }}>No content</div>
   }

   const title = aboutUsText.Title ?? ''
   const paragraph = aboutUsText.Paragraph ?? ''
   // prefer original (highest quality) `url` from API, then fall back to formats
   const bgRaw = aboutUsText.Background?.url ?? aboutUsText.Background?.formats?.large?.url ?? aboutUsText.Background?.formats?.medium?.url ?? aboutUsText.Background?.formats?.small?.url ?? undefined
   const bgUrl = resolveUrl(bgRaw)

   return (

      <>
         <div className={styles.hero} style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}>
            <div className={styles.overlay} />
            <div className={styles.container}>
               <PageHeader title={title} />
               <div className={styles.panel}>
                  <div className={styles.content}>
                     <ReactMarkdown>{paragraph}</ReactMarkdown>
                  </div>
               </div>
            </div>

         </div>

         <AboutUsGrid data={aboutUsGrid} />
      </>
   )
}
