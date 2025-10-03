<style>
    .blip-definition {
        font-weight: 600;
        font-size: 1.4rem;
    }
</style>

<script>
  import { getBlips } from '../lib/sanity';
  let blipsPromise = getBlips();
</script>

<h1 class="animated">Blips</h1>
<article>
    <p class="blip-definition">Blip (noun) - a radar ping</p>
    <p>My Blips are basically my blog. Not to be confused with my <a href="https://ethmarks.github.io/posts/">Posts</a>, which are long-form and semi-professional articles. A Blip is closer to a Tumblelog than a Post. I blip about random things that I've decided that you should know but that aren't substantial enough to merit a full Post.</p>
    <p>~Ethan</p>
    <div id="blips">
        {#await blipsPromise}
            <p>Loading blips...</p>
        {:then blips}
            <p>Found {blips.length} blips!</p>
        {:catch error}
            <p>Error loading blips: {error.message}</p>
        {/await}
    </div>
</article>
