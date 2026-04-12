import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchNavItems, fetchSocials, getSectionBackgrounds } from "../lib/api";

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
export const revalidate = 86400; // 1 day

export default async function LocaleLayout({
   children,
   params,
}: {
   children: React.ReactNode;
   params: Promise<{ locale: string }>;
}) {
   const { locale } = await params;

   const [sectionBackgrounds, navItems, socials] = await Promise.all([
      getSectionBackgrounds(locale),
      fetchNavItems(locale),
      fetchSocials(locale),
   ]);

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
         <Navbar locale={locale} initialItems={navItems} />
         <main style={{ flex: 1 }}>
            {children}
         </main>
         <Footer locale={locale} navItems={navItems} socials={socials} />
      </div>
   );
}
