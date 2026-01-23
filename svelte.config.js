import adapter from "@sveltejs/adapter-auto";

const basePath = process.env.BASE_PATH || ""; // "/blips"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: basePath,
      relative: false,
    },
  },
};

export default config;
