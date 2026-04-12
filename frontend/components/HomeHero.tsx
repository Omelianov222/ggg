import AccordionClient from "@/app/[locale]/homePage2/AccordionClient";
import BrandFamily from "./FamilyBrand";
import AboutUs from "./AboutUs";

type BrandItem = { title: string; image?: string };

export default function HomeHero({
   data,
   locale,
   brands,
}: {
   data: any;
   locale: string;
   brands: BrandItem[];
}) {
   return (
      <>
         <section>
            <AccordionClient brands={brands} />
            <AboutUs locale={locale} />
            <BrandFamily />
         </section>
      </>
   );
}
