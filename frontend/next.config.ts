import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   /* config options here */
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: '/dopkzbxj2/**'
         },
      ],
      unoptimized: true,
   },
   // i18n routing removed: using app/[locale] segmented routes instead to
   // handle locales manually in the App Router. Declaring `i18n` here would
   // conflict with the `[locale]` route segment and can cause 404s.

};

export default nextConfig;
