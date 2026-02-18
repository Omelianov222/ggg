import React from "react";
import DealersMap from "../../../components/DealersMap";
import dealers from '../../../data/dealers';
import { PageHeader } from "@/components/UI/PageHeader";
import FamilyBrand from "@/components/FamilyBrand";

export default function DealersPage() {
   const data = dealers;

   return (
      <div >
         <PageHeader title="Our Dealers" />
         <DealersMap data={data} />
         <FamilyBrand />
      </div>
   );
}
