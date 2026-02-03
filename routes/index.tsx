import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import fetchBlips from "../utils/fetchBlips.ts";
import { render } from "gfm";
import postProcessCitations from "../utils/blockquoteCitations.ts";

function renderMarkdown(markdown: string) {
  let html = render(markdown);
  html = postProcessCitations(html);
  return html;
}

const data = await fetchBlips();

const blipsWithRenderedContent = data.blips.map((blip) => ({
  ...blip,
  renderedContent: renderMarkdown(blip.content),
}));
const allBlipsShown = data.allBlipsShown;

export default define.page(function Home() {
  const canonUrl = "https://site-ethmarks.vercel.app/blips";
  const title = "Blips";
  const desc =
    "Ethan's microblog featuring brief thoughts, activities, and interesting discoveries. A radar ping of activity.";
  const img = "/blips.png";

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
        <script
          src="https://site-ethmarks.vercel.app/common/ethmarks.wc.js"
          defer
        >
        </script>
      </Head>
      <eth-header active="blips"></eth-header>
      <main>
        <h1>Blips</h1>
      </main>
      <eth-footer source="https://github.com/ethmarks/blips"></eth-footer>
    </>
  );
});
