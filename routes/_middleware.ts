import { define } from "../utils.ts";

export default define.middleware(async (ctx) => {
  const res = await ctx.next();
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=1, stale-while-revalidate=3600",
  );
  return res;
});
