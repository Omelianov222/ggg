import AccordionClient from "@/app/[locale]/homePage2/AccordionClient";

export default function HomeHero({ data, locale }: { data: any; locale: string }) {
   // Expect `data` to be the Strapi response node; pass attributes to LandingGrid
   const attrs = data?.attributes ?? {};
   return (
      <>
         <section>
            <AccordionClient locale={locale} />
         </section>

      </>
   );
}
