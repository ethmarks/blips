<script>
    import { getBlips } from "../lib/sanity";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import Blip from "../lib/components/blip.svelte";
    import BlipSkeleton from "../lib/components/BlipSkeleton.svelte";

    const pageSize = 20;
    const useSample = false; // for testing purposes only

    let currentPage = 1;
    let skeletonConfig = [];
    let blipsPromise = Promise.resolve({ blips: [], hasMore: false });

    // Simple cache: map of page number to blips
    const pageCache = new Map();

    async function fetchWindowedBlips(page = 1) {
        // Check if we have the current page cached
        if (pageCache.has(page)) {
            // Return cached data immediately
            return pageCache.get(page);
        }

        // Fetch a window: prev page + current page + next page
        const startPage = Math.max(1, page - 1);
        const endPage = page + 1;

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

        // Return current page data
        return pageCache.get(page);
    }

    function generateSkeletonConfig() {
        const SKELETON_LINES_MIN = 3;
        const SKELETON_LINES_MAX = 6;
        const SKELETON_WIDTH_MIN = 80;
        const SKELETON_WIDTH_MAX = 100;

        // Seeded random number generator using Linear Congruential Generator
        let seed = 8;
        function seededRandom() {
            seed = (seed * 1664525 + 1013904223) % Math.pow(2, 32);
            return seed / Math.pow(2, 32);
        }

        const count = pageSize;
        skeletonConfig = Array.from({ length: count }, () => ({
            lineCount:
                Math.floor(
                    seededRandom() *
                        (SKELETON_LINES_MAX - SKELETON_LINES_MIN + 1),
                ) + SKELETON_LINES_MIN,
            lineWidths: Array.from(
                {
                    length:
                        Math.floor(
                            seededRandom() *
                                (SKELETON_LINES_MAX - SKELETON_LINES_MIN + 1),
                        ) + SKELETON_LINES_MIN,
                },
                () =>
                    Math.floor(
                        seededRandom() *
                            (SKELETON_WIDTH_MAX - SKELETON_WIDTH_MIN + 1),
                    ) + SKELETON_WIDTH_MIN,
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

        blipsPromise = fetchWindowedBlips(newPage);
    }

    generateSkeletonConfig();

    onMount(() => {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            currentPage = parseInt(params.get("p")) || 1;
        }
        blipsPromise = fetchWindowedBlips(currentPage);
    });
</script>

<h1 class="animated">Blips</h1>
<article class="animated">
    <p id="definition">Blip (noun) - a ping of activity on a radar</p>
    <div id="intro-text">
        <p>
            My Blips are basically my blog. Not to be confused with my <a
                href="https://ethmarks.github.io/posts/">Posts</a
            >, which are long-form and semi-professional articles. Think of
            Blips as Ethan-flavoured Tumblr. I blip about what I'm up to or
            about random interesting things I've found that aren't substantial
            enough to merit a full Post.
        </p>
        <p>~Ethan</p>
    </div>
    <div id="blips">
        {#await blipsPromise}
            {#each skeletonConfig as config, i}
                <BlipSkeleton
                    lineCount={config.lineCount}
                    lineWidths={config.lineWidths}
                />
            {/each}
        {:then data}
            {#each data.blips as blip}
                <Blip {blip} />
            {/each}

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
                {#if data.hasMore}
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
        {:catch error}
            <p>Error loading blips: {error.message}</p>
        {/await}
    </div>
</article>

<style>
    #definition {
        font-weight: 600;
        font-size: 1.4rem;
    }

    #intro-text {
        color: #c7c7c7;
    }

    #blips {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
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
