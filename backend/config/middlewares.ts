export default [
   'strapi::logger',
   'strapi::errors',
   'global::cache-control',
   {
      name: 'strapi::security',
      config: {
         contentSecurityPolicy: {
            useDefaults: true,
            directives: {
               'img-src': [
                  "'self'",
                  'data:',
                  'blob:',
                  'https://market-assets.strapi.io',
                  'https://res.cloudinary.com',
               ],
               'media-src': [
                  "'self'",
                  'data:',
                  'blob:',
                  'https://res.cloudinary.com',
               ],
            },
         },
      },
   },
   'strapi::cors',
   'strapi::poweredBy',
   'strapi::query',
   'strapi::body',
   'strapi::session',
   'strapi::favicon',
   'strapi::public',
];
