import { error } from "@sveltejs/kit";
import { getBlips } from "../lib/sanity.js";

export async function load() {
  try {
    const data = await getBlips();

    return {
      blips: data.blips,
    };
  } catch (err) {
    throw error(500, `Failed to load blips: ${err.message}`);
  }
}
