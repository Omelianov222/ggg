import AccordionClient from "@/app/[locale]/homePage2/AccordionClient";
import BrandFamily from "./FamilyBrand";
import ContactForm from "./ContactForm";
import AboutUs from "./AboutUs";
import SectionDivider from "./SectionDivider";
import MailInfo from "./MailInfo";

type StrapiNode = { attributes?: Record<string, unknown> } | null | undefined;

export default function HomeHero({ locale }: { data?: StrapiNode; locale: string }) {
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
