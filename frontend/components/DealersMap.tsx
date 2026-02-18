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

      const lightTiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
         attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
         noWrap: true,
      });

      const darkTiles = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
         attribution: '&copy; <a href="https://carto.com/attributions">Carto</a>',
         subdomains: 'abcd',
         noWrap: true,
      });

      // choose initial tile layer by OS preference
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const useDark = mql.matches;
      if (useDark) darkTiles.addTo(map);
      else lightTiles.addTo(map);

      // listen for theme changes and swap tile layers
      type MQ = MediaQueryList & {
         addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
         removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
      };

      const onThemeChange = (e: MediaQueryListEvent) => {
         if (e.matches) {
            map.removeLayer(lightTiles);
            darkTiles.addTo(map);
         } else {
            map.removeLayer(darkTiles);
            lightTiles.addTo(map);
         }
      };
      // modern browsers
      const mq = mql as MQ;
      if (mq.addEventListener) mq.addEventListener('change', onThemeChange);
      else if (mq.addListener) mq.addListener(onThemeChange);

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
         // use modal instead of popup; clicking marker opens modal with dealers
         marker.on('click', () => {
            setSelected(d);
            setOpen(true);
         });
      });

      return () => {
         try {
            if (mq.removeEventListener) mq.removeEventListener('change', onThemeChange);
            else if (mq.removeListener) mq.removeListener(onThemeChange);
         } catch { }
         map.remove();
         leafletMap.current = null;
      };
   }, [data]);

   return (
      <div>
         <div ref={mapRef} style={{ height: "70vh", width: "70%", margin: "0 auto", borderRadius: "30px", overflow: "hidden" }} />
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
