import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAPI, getSectionBackgrounds } from "../lib/api";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Site Title",
   description: "Site description",
};

export default async function LocaleLayout({
   children,
   params,
}: {
   children: React.ReactNode;
   params: Promise<{ locale: string }>;
}) {
   const { locale } = await params;

   const sectionBackgrounds = await getSectionBackgrounds(locale);

   console.log("Section Backgrounds:", JSON.stringify(sectionBackgrounds))
   const res = await fetchAPI('/api/navbars', locale)
   const data = res.data || []

   const items = data.map((item: any) => {
      if (item.locale === locale) {
         return { label: item.Label, link: item.Link }
      }
      const loc = item.localizations?.find((l: any) => l.locale === locale)
      return loc ? { label: loc.Label, link: loc.Link } : { label: item.Label, link: item.Link }
   })
   // Do not render <html> or <body> here — those must be rendered once in the root layout.
   // Apply the font variables and other body-level classes on a top-level wrapper instead.
   return (
      <div
         data-locale={locale}
         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            overflow: 'hidden',
            ...Object.fromEntries(
               Object.entries(sectionBackgrounds).map(([key, url]) => [
                  `--bg-${key.toLowerCase()}`,
                  `url(${url})`
               ])
            ),
         }}
      >
         <Navbar locale={locale} initialItems={items} />
         <main style={{ flex: 1 }}>
            {children}
         </main>
         <Footer locale={locale} />
      </div>
   );
}
