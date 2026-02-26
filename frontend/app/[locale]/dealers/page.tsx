import React from "react";
import DealersMap from "../../../components/DealersMap";
import dealers from '../../../data/dealers';
import { PageHeader } from "@/components/UI/PageHeader";
import FamilyBrand from "@/components/FamilyBrand";
import style from "./Dealers.module.css"
export default function DealersPage() {
   const data = dealers;

   return (
      <section className={style.dealerContainer}>
         <PageHeader title="Our Dealers" />
         <DealersMap data={data} />
         <FamilyBrand />
      </section>
   );
}
