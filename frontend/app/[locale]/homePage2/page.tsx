import React from "react";
import AccordionClient from "./AccordionClient";
import AboutUs from "@/components/AboutUs";
import { Divider } from "@/components/UI/Divider";

export default function Page({ params }: { params: { locale: string } }) {
   const locale = params.locale ?? "en";
   return (
      <main>

         <AccordionClient locale={locale} />

         <AboutUs locale={locale} />
      </main>
   );
}
