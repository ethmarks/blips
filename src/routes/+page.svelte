<script>
    import { getBlips } from "../lib/sanity";
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import Blip from "../lib/components/blip.svelte";
    import BlipSkeleton from "../lib/components/BlipSkeleton.svelte";

    const pageSize = 20;
    const useSample = false; // for testing purposes only
    const updateInterval = 60000;

    let blips = [];
    let loading = true;
    let error = null;
    let updateTimer;
    let currentPage = 1;
    let hasMore = false;
    let skeletonConfig = [];

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
            // Generate skeleton config once when loading starts
            generateSkeletonConfig();
        }

        // Fetch a window: prev page + current page + next page
        const startPage = Math.max(1, page - 1);
        const endPage = page + 1;

        try {
            // Fetch each page in the window
            for (let p = startPage; p <= endPage; p++) {
                if (!pageCache.has(p)) {
                    const result = await getBlips(useSample, p, pageSize);
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

    async function silentAutoUpdate() {
        try {
            // Fetch fresh data for page 1 without affecting loading state
            const result = await getBlips(useSample, 1, pageSize);

            // Update cache with fresh data
            pageCache.set(1, {
                blips: result.blips,
                hasMore: result.hasMore,
            });

            // If we're currently on page 1, update the display
            if (currentPage === 1) {
                blips = result.blips;
                hasMore = result.hasMore;
            }
        } catch (err) {
            // Silently fail - don't update error state during auto-update
            console.warn("Auto-update failed:", err);
        }
    }

    function generateSkeletonConfig() {
        const count = Math.floor(Math.random() * 11) + 10; // 10-20 skeletons
        skeletonConfig = Array.from({ length: count }, () => ({
            lineCount: Math.floor(Math.random() * 3) + 1, // 1-3 lines
            lineWidths: Array.from(
                { length: Math.floor(Math.random() * 3) + 1 },
                () => Math.floor(Math.random() * 40) + 40, // 40-80% width
            ),
        }));
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
        generateSkeletonConfig();
        fetchWindowedBlips(currentPage);

        updateTimer = setInterval(() => {
            // only auto-update on first page
            if (currentPage === 1) {
                silentAutoUpdate();
            }
        }, updateInterval);
    });

    onDestroy(() => {
        if (updateTimer) {
            clearInterval(updateTimer);
        }
    });
</script>

<h1 class="animated">Blips</h1>
<article>
    <p class="blip-definition">Blip (noun) - a ping of activity on a radar</p>
    <p>
        My Blips are basically my blog. Not to be confused with my <a
            href="https://ethmarks.github.io/posts/">Posts</a
        >, which are long-form and semi-professional articles. Think of Blips as
        Ethan-flavoured Tumblr. I blip about what I'm up to or about random
        interesting things I've found that aren't substantial enough to merit a
        full Post.
    </p>
    <p>~Ethan</p>
    <div id="blips">
        {#if loading}
            {#each skeletonConfig as config, i}
                <BlipSkeleton
                    lineCount={config.lineCount}
                    lineWidths={config.lineWidths}
                />
            {/each}
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
