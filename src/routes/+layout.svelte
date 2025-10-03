<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://ethmarks.github.io/css/global.min.css">
    <script src="https://ethmarks.github.io/js/ethmarks-components.js" defer></script>
</svelte:head>

<ethmarks-header></ethmarks-header>
<main>
{@render children?.()}
</main>
<ethmarks-footer></ethmarks-footer>
