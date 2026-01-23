import adapter from "@sveltejs/adapter-static";

const basePath = process.env.BASE_PATH || "";
const outDir = process.env.OUT_DIR || "dist";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: outDir,
      assets: outDir,
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    paths: {
      base: basePath,
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Only throw on actual errors, not 404s during prerendering
        if (path.startsWith("/api/")) {
          throw new Error(message);
        }
      },
      entries: ["*"],
    },
  },
};

export default config;
