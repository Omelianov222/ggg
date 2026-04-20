import React from "react";
import { fetchAPI } from "@/app/lib/api";
import AccordionClient from "./AccordionClient";
import AboutUs from "@/components/AboutUs";

type BrandItem = {
   id?: number;
   BrandLabel?: string;
   Brand?: { url?: string; formats?: { large?: { url?: string } } };
};

export default async function Page({ params }: { params: { locale: string } }) {
   const locale = params.locale ?? "en";
   const brandsRes = await fetchAPI('/api/main-page-brands', locale);
   const brandsData: BrandItem[] = brandsRes instanceof Error ? [] : (brandsRes?.data ?? []);

   return (
      <main>
         <AccordionClient initialData={brandsData} />
         <AboutUs locale={locale} />
      </main>
   );
}
