<script>
    import { getBlips } from "../lib/sanity";
    import { onMount, onDestroy } from "svelte";
    import Blip from "../lib/components/blip.svelte";

    let blips = [];
    let loading = true;
    let error = null;
    let updateInterval;
    let timeUpdateInterval;

    async function fetchBlips() {
        try {
            const newBlips = await getBlips();

            // Only update blips if there are new ones or if this is the first load
            if (
                blips.length === 0 ||
                newBlips.length !== blips.length ||
                (newBlips.length > 0 &&
                    blips.length > 0 &&
                    newBlips[0]._id !== blips[0]._id)
            ) {
                blips = newBlips;
            }

            loading = false;
            error = null;
        } catch (err) {
            error = err;
            loading = false;
        }
    }

    onMount(() => {
        fetchBlips();
        updateInterval = setInterval(fetchBlips, 60000);
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
        {/if}
    </div>
</article>

<style>
    .blip-definition {
        font-weight: 600;
        font-size: 1.4rem;
    }
</style>
