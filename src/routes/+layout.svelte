<script>
	let { children } = $props();
	import '../lib/handleOverflow';
</script>

<svelte:head>
	<link rel="icon" href="https://ethmarks.github.io/favicon.ico" />
	<link rel="stylesheet" href="https://ethmarks.github.io/css/global.min.css">
    <script src="https://ethmarks.github.io/js/ethmarks-components.js" defer></script>
</svelte:head>

<ethmarks-header></ethmarks-header>
<main>
{@render children?.()}
</main>
<ethmarks-footer></ethmarks-footer>
