<script>
    import { getBlips } from "../lib/sanity";
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import Blip from "../lib/components/blip.svelte";

    let blips = [];
    let loading = true;
    let error = null;
    let updateInterval;
    let currentPage = 1;
    let hasMore = false;
    const pageSize = 20;

    async function fetchBlips(page = 1) {
        try {
            loading = true;
            const result = await getBlips(true, page, pageSize);

            blips = result.blips;
            hasMore = result.hasMore;

            loading = false;
            error = null;
        } catch (err) {
            error = err;
            loading = false;
        }
    }

    onMount(() => {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            currentPage = parseInt(params.get("p")) || 1;
        }
        fetchBlips(currentPage);

        updateInterval = setInterval(() => {
            // only auto-update on first page
            if (currentPage === 1) {
                fetchBlips(1);
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
                        data-sveltekit-reload
                    >
                        ← Previous page
                    </a>
                {/if}
                {#if hasMore}
                    <a
                        href="/?p={currentPage + 1}"
                        id="more-link"
                        data-sveltekit-reload
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
