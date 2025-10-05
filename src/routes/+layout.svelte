<script>
    let { children } = $props();
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://ethmarks.github.io/css/global.min.css"
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
<ethmarks-footer></ethmarks-footer>

<style>
    main {
        @media (min-width: 768px) {
            --main-margin-sides: 16vw;
        }
    }
</style>
