import AccordionClient from "@/app/[locale]/homePage2/AccordionClient";
import BrandFamily from "./FamilyBrand";
import ContactForm from "./ContactForm";
import AboutUs from "./AboutUs";
import SectionDivider from "./SectionDivider";
import MailInfo from "./MailInfo";

export default function HomeHero({ data, locale }: { data: any; locale: string }) {
   // Expect `data` to be the Strapi response node; pass attributes to LandingGrid
   const attrs = data?.attributes ?? {};
   return (
      <>
         <section>
            <AccordionClient locale={locale} />
            {/* <SectionDivider /> */}
            <AboutUs locale={locale} />
            <BrandFamily />
            {/* <MailInfo /> */}
         </section>

      </>
   );
}
