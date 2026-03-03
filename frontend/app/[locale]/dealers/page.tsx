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
         <div style={{ background: "#fff", color: "var(--family-text)", padding: "2rem 0 0 0" }}>
            <p style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}> Lorem ipsum dolor sit amet consectetur adipisicing elit. Error accusantium iure tenetur, corporis officia adipisci voluptatibus ullam architecto voluptas illum quasi quia asperiores rerum provident ea mollitia a molestias numquam?</p>
         </div>
         <FamilyBrand />
      </section>
   );
}
