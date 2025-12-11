import LandingGrid from "./LandingGrid";
import AboutUs from "./AboutUs";

export default function HomeHero({ data, locale }: { data: any; locale: string }) {
   // Expect `data` to be the Strapi response node; pass attributes to LandingGrid
   const attrs = data?.attributes ?? {};
   return (
      <>
         <section>
            <LandingGrid attributes={attrs} locale={locale} />
         </section>
         <AboutUs
            title={attrs?.aboutTitle}
            content={attrs?.aboutContent}
            locale={locale}
         />
      </>
   );
}
