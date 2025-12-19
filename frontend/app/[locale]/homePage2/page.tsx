import React from "react";
import AccordionClient from "./AccordionClient";
import AboutUs from "@/components/AboutUs";

export default function Page({ params }: { params: { locale: string } }) {
   const locale = params.locale ?? "en";
   return (
      <main>
         <h1 style={{ position: "absolute", left: -9999 }}>Accordion demo</h1>
         <AccordionClient locale={locale} />
         <AboutUs locale={locale} />
      </main>
   );
}
