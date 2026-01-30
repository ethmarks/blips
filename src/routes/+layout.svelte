<script>
    let { children } = $props();

    const canonUrl = "https://ethmarks.github.io/blips";
    const title = "Blips";
    const desc =
        "Ethan's microblog featuring brief thoughts, activities, and interesting discoveries. A radar ping of activity.";
    const img = "/blips.png";
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={desc} />

    <link rel="canonical" href={canonUrl} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={desc} />
    <meta property="og:image" content={canonUrl + img} />
    <meta property="og:url" content={canonUrl} />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={desc} />
    <meta name="twitter:image" content={canonUrl + img} />

    <link
        rel="alternate"
        type="application/rss+xml"
        title="Blips RSS Feed"
        href="https://ethmarks.github.io/blips/rss.xml"
    />
    <link
        rel="stylesheet"
        href="https://ethmarks.github.io/css/global.min.css"
    />
    <link
        rel="stylesheet"
        href="https://ethmarks.github.io/css/blips.min.css"
    />
    <script
        src="https://ethmarks.github.io/js/ethmarks-components.js"
        defer
    ></script>
</svelte:head>

<ethmarks-header active="blips"></ethmarks-header>

<main>
    {@render children?.()}
</main>

<ethmarks-footer source="https://github.com/ethmarks/blips"></ethmarks-footer>

<style>
    main {
        @media (min-width: 768px) {
            --main-margin-sides: 16vw;
        }
    }
</style>
