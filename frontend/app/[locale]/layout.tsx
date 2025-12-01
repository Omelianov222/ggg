import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";

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
   // Do not render <html> or <body> here — those must be rendered once in the root layout.
   // Apply the font variables and other body-level classes on a top-level wrapper instead.
   return (
      <div
         data-locale={locale}
         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
         <Navbar locale={locale} />
         {children}
      </div>
   );
}
