<script>
    import { getBlips } from "../lib/sanity";
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import Blip from "../lib/components/blip.svelte";

    let blips = [];
    let loading = true;
    let error = null;
    let updateInterval;
    let currentPage = 1;
    let hasMore = false;
    const pageSize = 5;

    // Simple cache: map of page number to blips
    const pageCache = new Map();

    async function fetchWindowedBlips(page = 1) {
        // Check if we have the current page cached
        if (pageCache.has(page)) {
            // Load instantly from cache
            blips = pageCache.get(page).blips;
            hasMore = pageCache.get(page).hasMore;
            loading = false;
        } else {
            loading = true;
        }

        // Fetch a window: prev page + current page + next page
        const startPage = Math.max(1, page - 1);
        const endPage = page + 1;

        try {
            // Fetch each page in the window
            for (let p = startPage; p <= endPage; p++) {
                if (!pageCache.has(p)) {
                    const result = await getBlips(true, p, pageSize);
                    pageCache.set(p, {
                        blips: result.blips,
                        hasMore: result.hasMore,
                    });
                }
            }

            // Update display with current page data
            if (pageCache.has(page)) {
                blips = pageCache.get(page).blips;
                hasMore = pageCache.get(page).hasMore;
            }

            loading = false;
            error = null;
        } catch (err) {
            error = err;
            loading = false;
        }
    }

    function navigateToPage(newPage) {
        if (newPage === currentPage) return;

        currentPage = newPage;

        // Update URL
        const url = new URL(window.location);
        if (newPage === 1) {
            url.searchParams.delete("p");
        } else {
            url.searchParams.set("p", newPage.toString());
        }
        goto(url.pathname + url.search, { replaceState: false });

        fetchWindowedBlips(newPage);
    }

    onMount(() => {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            currentPage = parseInt(params.get("p")) || 1;
        }
        fetchWindowedBlips(currentPage);

        updateInterval = setInterval(() => {
            // only auto-update on first page
            if (currentPage === 1) {
                pageCache.clear(); // Clear cache for fresh data
                fetchWindowedBlips(1);
            }
        }, 60000);
    });

    onDestroy(() => {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    });
</script>

<h1 class="animated">Blips</h1>
<article>
    <p class="blip-definition">Blip (noun) - a radar ping</p>
    <p>
        My Blips are basically my blog. Not to be confused with my <a
            href="https://ethmarks.github.io/posts/">Posts</a
        >, which are long-form and semi-professional articles. A Blip is closer
        to a Tumblelog than a Post. I blip about random things that I've decided
        that you should know but that aren't substantial enough to merit a full
        Post.
    </p>
    <p>~Ethan</p>
    <div id="blips">
        {#if loading}
            <p>Loading blips...</p>
        {:else if error}
            <p>Error loading blips: {error.message}</p>
        {:else}
            {#each blips as blip}
                <Blip {blip} />
            {/each}
            <hr />

            <nav>
                {#if currentPage > 1}
                    <a
                        href="/?p={currentPage - 1}"
                        id="back-link"
                        on:click|preventDefault={() =>
                            navigateToPage(currentPage - 1)}
                    >
                        ← Previous page
                    </a>
                {/if}
                {#if hasMore}
                    <a
                        href="/?p={currentPage + 1}"
                        id="more-link"
                        on:click|preventDefault={() =>
                            navigateToPage(currentPage + 1)}
                    >
                        Next page →
                    </a>
                {/if}
            </nav>
        {/if}
    </div>
</article>

<style>
    .blip-definition {
        font-weight: 600;
        font-size: 1.4rem;
    }

    nav {
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: 1fr;

        #back-link {
            grid-column: 1;
            justify-self: start;
        }
        #more-link {
            grid-column: 3;
            justify-self: end;
        }
    }
</style>
