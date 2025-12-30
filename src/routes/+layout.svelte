<script>
    let { children } = $props();
</script>

<svelte:head>
    <title>Blips</title>
    <meta name="title" content="Blips" />
    <meta
        name="description"
        content="Ethan's microblog featuring brief thoughts, activities, and interesting discoveries. A radar ping of activity."
    />
    <meta name="author" content="Ethan" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Blips" />
    <meta
        property="og:description"
        content="Ethan's microblog featuring brief thoughts, activities, and interesting discoveries. A radar ping of activity."
    />
    <meta property="og:site_name" content="Blips" />
    <meta property="twitter:card" content="summary" />
    <meta property="twitter:title" content="Blips" />
    <meta
        property="twitter:description"
        content="Ethan's microblog featuring brief thoughts, activities, and interesting discoveries. A radar ping of activity."
    />
    <link rel="canonical" href="https://ethmarks.github.io/blips" />
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
        src="https://ethmarks.vercel.app/js/ethmarks-components.js"
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
