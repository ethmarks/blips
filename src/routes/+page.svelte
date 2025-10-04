<script>
    import { marked } from "marked";
    import { getBlips } from "../lib/sanity";

    let blipsPromise = getBlips();

    // Call overflow check after blips load
    blipsPromise.then(() => {
        setTimeout(() => {
            if (typeof window !== 'undefined' && window.updateOverflowClasses) {
                window.updateOverflowClasses();
            }
        }, 50);
    });

    function renderMarkdown(markdown) {
        return marked(markdown || "");
    }

    function parseCreatedAt(createdAtDate) {
        const minutesElapsed = Math.floor(
            (Date.now() - createdAtDate.getTime()) / 60000,
        );
        if (minutesElapsed < 1) {
            return "now";
        } else if (minutesElapsed <= 60) {
            return minutesElapsed + "m ago";
        } else {
            const options = {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                hour12: "true",
                minute: "numeric",
            };
            return createdAtDate.toLocaleString("en-GB", options);
        }
    }
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
        {#await blipsPromise}
            <p>Loading blips...</p>
        {:then blips}
            {#each blips as blip}
                <hr />
                <div>{@html renderMarkdown(blip.content)}</div>
                {@const createdAtDate = new Date(blip._createdAt)}
                <time datetime={createdAtDate.toISOString()} class="blip-time">
                    {parseCreatedAt(createdAtDate)}
                </time>
            {/each}
        {:catch error}
            <p>Error loading blips: {error.message}</p>
        {/await}
    </div>
</article>

<style>
    .blip-definition {
        font-weight: 600;
        font-size: 1.4rem;
    }
    .blip-time {
        font-size: 0.8rem;
        color: gray;
    }
</style>
