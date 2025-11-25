import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

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

export default function LocaleLayout({
   children,
   params,
}: {
   children: React.ReactNode;
   params: { locale: string };
}) {
   return (
      <html lang={params.locale}>
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
         </body>
      </html>
   );
}
