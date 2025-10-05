<script>
    import { marked } from "marked";
    import { onMount, onDestroy } from "svelte";

    export let blip;

    let currentTime = Date.now();
    let timeUpdateInterval;

    function renderMarkdown(markdown) {
        return marked(markdown || "");
    }

    function parseCreatedAt(createdAtDate, now = currentTime) {
        const minutesElapsed = Math.floor(
            (now - createdAtDate.getTime()) / 60000,
        );
        const sameDay = createdAtDate.toDateString() === new Date(now).toDateString();
        if (minutesElapsed < 1) {
            return "now";
        } else if (minutesElapsed <= 60) {
            return `${minutesElapsed}m ago`;
        } else if (sameDay) {
            const hoursElapsed = Math.floor(minutesElapsed / 60);
            const remainingMinutes = minutesElapsed % 60;
            return `${hoursElapsed}h ${remainingMinutes}m ago`;
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

    $: createdAtDate = new Date(blip._createdAt);
    $: timeDisplay = parseCreatedAt(createdAtDate, currentTime);

    function updateCurrentTime() {
        currentTime = Date.now();
    }

    onMount(() => {
        timeUpdateInterval = setInterval(updateCurrentTime, 5000);
    });

    onDestroy(() => {
        if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
        }
    });
</script>

<div class="blip">
    <hr />
    <div>{@html renderMarkdown(blip.content)}</div>
    <time datetime={createdAtDate.toISOString()} class="blip-time">
        {timeDisplay}
    </time>
</div>

<style>
    .blip-time {
        font-size: 0.8rem;
        color: gray;
    }
</style>
