<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import Blip from "$lib/components/blip.svelte";
    import { updateOverflowClasses } from "$lib/overflowHandler.js";

    // Get preloaded data from the server
    let { data } = $props();

    onMount(() => {
        if (browser) {
            window.addEventListener("resize", updateOverflowClasses);
            // Run overflow classes after mount
            setTimeout(updateOverflowClasses, 1);
        }
    });
</script>

<h1 class="animated">Blips</h1>
<article class="animated">
    <div id="intro-top">
        <p id="definition">Blip (noun) - a ping of activity on a radar</p>
        <p id="rss"><a href="rss.xml">RSS</a></p>
    </div>
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
        {#each data.blips as blip}
            <Blip {blip} />
        {/each}
    </div>
</article>

<style>
    article {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    #intro-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0.5rem 0;
    }

    #definition {
        font-weight: 600;
        font-size: 1.4rem;
        margin: 0;
    }

    #rss {
        margin: 0;

        @media (min-width: 768px) {
            align-content: center;
        }
    }

    #intro-text {
        color: #c7c7c7;
    }

    #blips {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
</style>
