import { fetchAPI } from "@/app/lib/api";
import AccordionClient from "@/app/[locale]/homePage2/AccordionClient";
import BrandFamily from "./FamilyBrand";
import ContactForm from "./ContactForm";
import AboutUs from "./AboutUs";
import SectionDivider from "./SectionDivider";
import MailInfo from "./MailInfo";

type StrapiNode = { attributes?: Record<string, unknown> } | null | undefined;

type BrandItem = {
   id?: number;
   BrandLabel?: string;
   Brand?: { url?: string; formats?: { large?: { url?: string } } };
};

export default async function HomeHero({ locale }: { data?: StrapiNode; locale: string }) {
   const brandsRes = await fetchAPI('/api/main-page-brands', locale);
   const brandsData: BrandItem[] = brandsRes instanceof Error ? [] : (brandsRes?.data ?? []);

   return (
      <>
         <section>
            <AccordionClient initialData={brandsData} />
            {/* <SectionDivider /> */}
            <AboutUs locale={locale} />
            <BrandFamily />
            {/* <MailInfo /> */}
         </section>
      </>
   );
}
