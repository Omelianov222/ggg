const MAX_AGE = 3600; // 1 година

export default () => {
   return async (ctx: any, next: () => Promise<void>) => {
      await next();

      const isApiRoute = (ctx.path as string).startsWith('/api/');
      const isGet = ctx.method === 'GET';
      const isSuccess = ctx.status >= 200 && ctx.status < 300;

      if (isApiRoute && isGet && isSuccess) {
         ctx.set('Cache-Control', `public, max-age=${MAX_AGE}, s-maxage=${MAX_AGE}`);
      }
   };
};
