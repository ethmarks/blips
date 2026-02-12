import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { type Blip, fetchBlips } from "../utils/fetchBlips.ts";
import { renderMarkdown } from "../utils/renderMarkdown.ts";
import SingleBlip from "../components/SingleBlip.tsx";

function BlipsList({ renderedBlips }: { renderedBlips: Blip[] }) {
  return (
    <div id="blips">
      {renderedBlips.map((renderedBlip) => (
        <SingleBlip key={renderedBlip._id} {...renderedBlip} />
      ))}
    </div>
  );
}

function EndDiv({ allBlipsShown }: { allBlipsShown: boolean }) {
  if (allBlipsShown) {
    return null;
  }
  return (
    <div id="end">
      <p>Showing the latest 50 blips. Older ones are off-radar...</p>
    </div>
  );
}

export default define.page(async function Home() {
  const data = await fetchBlips();

  const blipsWithRenderedContent: Blip[] = data.blips.map((blip) => ({
    ...blip,
    renderedContent: renderMarkdown(blip.content),
  }));

  const allBlipsShown = data.allBlipsShown;

  const basePath = Deno.env.get("FRESH_BASE_PATH") || "";

  const canonUrl = "https://site-ethmarks.vercel.app/blips";
  const title = "Blips";
  const desc =
    "Ethan's microblog featuring brief thoughts, activities, and interesting discoveries. A radar ping of activity.";
  const img = basePath + "/blips.png";

  return (
    <>
      <Head>
        <title>Blips</title>
        <meta name="description" content={desc} />

        <link rel="canonical" href={canonUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={img} />
        <meta property="og:url" content={canonUrl} />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={desc} />
        <meta property="twitter:image" content={img} />

        <link
          rel="icon"
          href="https://site-ethmarks.vercel.app/common/ethmarks.ico"
          type="image/x-icon"
        />
        <link
          rel="stylesheet"
          href="https://site-ethmarks.vercel.app/common/ethmarks-rich.css"
        />
        <link
          rel="stylesheet"
          href={basePath + "/styles.css"}
        />
        <script
          src="https://site-ethmarks.vercel.app/common/ethmarks.wc.js"
          defer
        >
        </script>
        <script
          src="https://site-ethmarks.vercel.app/common/overflow.js"
          defer
        >
        </script>

        <script>
          {"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };"}
        </script>
        <script
          defer
          src="https://site-ethmarks.vercel.app/_vercel/insights/script.js"
        >
        </script>
      </Head>
      <eth-header active="blips"></eth-header>
      <main>
        <h1 class="animated">Blips</h1>
        <p id="rss" class="animated">
          <a href="rss.xml">RSS</a>
        </p>
        <article class="animated">
          <p>
            <a href="https://github.com/ethmarks/blips">Blips</a>{" "}
            is my personal microblog. I use Blips to host updates on what I'm
            doing, random thoughts I had, interesting things I learned, and
            things like that.
          </p>
          <p>
            The name comes from the nautical term "blip", meaning "a ping of
            activity on a radar".
          </p>
          <BlipsList renderedBlips={blipsWithRenderedContent} />
          <EndDiv allBlipsShown={allBlipsShown} />
        </article>
      </main>
      <eth-footer source="https://github.com/ethmarks/blips"></eth-footer>
    </>
  );
});
