import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";

const basePath = Deno.env.get("FRESH_BASE_PATH") || undefined; // "/blips"

export const app = new App<State>({
  basePath,
});

app.use(staticFiles());

// Include file-system based routes here
app.fsRoutes();
