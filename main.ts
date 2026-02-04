import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";

const basePath = Deno.env.get("FRESH_BASE_PATH") || undefined; // "/blips"

export const app = new App<State>({
  basePath,
})
  .use(async (ctx) => {
    const res = await ctx.next();
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=1, stale-while-revalidate=3600",
    );
    return res;
  });

app.use(staticFiles());

// Include file-system based routes here
app.fsRoutes();
