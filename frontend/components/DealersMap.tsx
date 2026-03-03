"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import DealersModal from "./DealersModal";

import "leaflet/dist/leaflet.css";

type Dealer = {
   country: string;
   region?: string;
   coords: number[];
   contacts: { name: string; phone?: string; email?: string }[];
};

export default function DealersMap({ data }: { data: Dealer[] }) {
   const mapRef = useRef<HTMLDivElement | null>(null);
   const leafletMap = useRef<L.Map | null>(null);
   const [selected, setSelected] = useState<Dealer | null>(null);
   const [open, setOpen] = useState(false);

   useEffect(() => {
      if (!mapRef.current) return;
      if (leafletMap.current) return; // already created

      // Inject tooltip and controls styles
      const style = document.createElement('style');
      style.textContent = `
        .dealer-tooltip {
          background-color: rgba(255, 255, 255, 0.85) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 8px !important;
          padding: 10px 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08) !important;
          color: #333 !important;
         
        }
        
        .dealer-tooltip .leaflet-tooltip-left::before,
        .dealer-tooltip .leaflet-tooltip-right::before,
        .dealer-tooltip .leaflet-tooltip-top::before,
        .dealer-tooltip .leaflet-tooltip-bottom::before {
          border-top-color: rgba(255, 255, 255, 0.3) !important;
        }
        
        .dealer-tooltip strong {
          color: #1a1a1a !important;
          font-weight: 600 !important;
        }
        
        .dealer-tooltip div {
          color: #555 !important;
        }
        
        .leaflet-control-zoom {
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          left: auto !important;
        }
      `;
      document.head.appendChild(style);

      const map = L.map(mapRef.current, {
         // prevent horizontal infinite scroll / world wrapping
         maxBounds: [[-90, -180], [90, 180]],
         maxBoundsViscosity: 1.0,
         worldCopyJump: false,
         // disable zoom with mouse wheel
         scrollWheelZoom: false,
         // prevent zooming out beyond the initial '100%';
         // assumption: initial zoom 2 corresponds to desired 100% minimum
         minZoom: 3,
         // reasonable maximum zoom for tiles
         maxZoom: 18,
      }).setView([20, 0], 2);
      leafletMap.current = map;

      const whiteTiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
         attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
         noWrap: true,
      });

      whiteTiles.addTo(map);

      // Add zoom controls to the top right
      L.control.zoom({
         position: 'topright'
      }).addTo(map);

      // default icon (use CDN image paths)
      L.Icon.Default.mergeOptions({
         iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
         iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
         shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      data.forEach((d) => {
         // ensure we pass a 2-tuple to Leaflet; data may be a plain number[]
         const coordsTuple: [number, number] = [d.coords[0], d.coords[1]];
         const marker = L.marker(coordsTuple).addTo(map);

         // Create tooltip content with dealer information
         const tooltipContent = `
            <div style="font-size: 13px; line-height: 1.5; letter-spacing: 0.3px;">
               <strong style="display: block; margin-bottom: 6px;">${d.region || d.country}</strong>
               ${d.contacts.map((c) => `<div style="margin-top: 4px; opacity: 0.9;">${c.name}</div>`).join('')}
            </div>
         `;

         // Add tooltip on hover
         marker.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: L.point(0, -10),
            className: 'dealer-tooltip',
            sticky: true
         });

         // use modal instead of popup; clicking marker opens modal with dealers
         marker.on('click', () => {
            setSelected(d);
            setOpen(true);
         });
      });

      return () => {
         map.remove();
         leafletMap.current = null;
      };
   }, [data]);

   return (
      <div style={{ padding: "0 0 50px 0", position: "relative" }}>
         <div ref={mapRef} style={{ height: "70vh", width: "min(1200px, 95vw)", margin: "0 auto", borderRadius: "30px", overflow: "hidden" }} />
         <DealersModal
            open={open}
            onClose={() => setOpen(false)}
            country={selected?.country}
            region={selected?.region}
            contacts={selected?.contacts}
         />
      </div>
   );
}
