import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
    paths: {
      base: "/blips",
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
