'use client';

import dynamic from 'next/dynamic';

type Dealer = {
   country: string;
   region?: string;
   coords: number[];
   contacts: { name: string; phone?: string; email?: string }[];
};

const DealersMap = dynamic(() => import('../../../components/DealersMap'), { ssr: false });

export default function DealersMapClient({ data }: { data: Dealer[] }) {
   return <DealersMap data={data} />;
}
