<script>
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(() => {
		function updateOverflowClasses() {
			const widthOverflowClass = "width-overflow";
			const heightOverflowClass = "height-overflow";

			const body = document.body;

			const contentWidth = body.scrollWidth;
			const contentHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);

			const containerWidth = window.innerWidth;
			const containerHeight = window.innerHeight;

			if (contentHeight === 0 || contentWidth === 0) {
				return;
			}

			if (contentWidth > containerWidth) {
				body.classList.add(widthOverflowClass);
			} else {
				body.classList.remove(widthOverflowClass);
			}

			if (contentHeight > containerHeight) {
				body.classList.add(heightOverflowClass);
			} else {
				body.classList.remove(heightOverflowClass);
			}
		}

		const resizeObserver = new ResizeObserver(() => {
			updateOverflowClasses();
		});

		resizeObserver.observe(document.body);
		updateOverflowClasses();

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", updateOverflowClasses);
		};
	});
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
