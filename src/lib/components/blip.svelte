<script>
    import { marked } from "marked";
    import { onMount, onDestroy } from "svelte";
    import { postProcessCitations } from "$lib/blockquoteCitations.js";
    import { postProcessExternalLinks } from "$lib/linkBlanker.js";

    export let blip;

    let currentTime = Date.now();
    let timeUpdateInterval;

    function renderMarkdown(markdown) {
        let html = marked(markdown || "");
        html = postProcessCitations(html);
        html = postProcessExternalLinks(html);
        return html;
    }

    function getAbsoluteDate(date) {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            hour12: "true",
            minute: "numeric",
        };
        return date.toLocaleString("en-GB", options);
    }

    function parseCreatedAt(createdAtDate, now = currentTime) {
        const minutesElapsed = Math.floor(
            (now - createdAtDate.getTime()) / 60000,
        );
        const sameDay =
            createdAtDate.toDateString() === new Date(now).toDateString();
        if (minutesElapsed < 1) {
            return "now";
        } else if (minutesElapsed <= 60) {
            return `${minutesElapsed}m ago`;
        } else if (sameDay) {
            const hoursElapsed = Math.floor(minutesElapsed / 60);
            const remainingMinutes = minutesElapsed % 60;
            return `${hoursElapsed}h ${remainingMinutes}m ago`;
        } else {
            return getAbsoluteDate(createdAtDate);
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
    <time
        datetime={createdAtDate.toISOString()}
        class="blip-time"
        title={getAbsoluteDate(createdAtDate)}
    >
        {timeDisplay}
    </time>
    <div class="blip-content">{@html renderMarkdown(blip.content)}</div>
</div>

<style>
    .blip {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0 1rem;
    }

    .blip-content:not(:has(> :only-child:is(blockquote, pre))) {
        background: rgba(255, 255, 255, 0.02);
        padding: 0.7rem 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .blip-content {
        > :global(:first-child) {
            margin-top: 0;
        }
        > :global(:last-child) {
            margin-bottom: 0;
        }
    }
    .blip-time {
        color: #a3a3a3;
        font-size: 0.8rem;
        text-align: right;
        white-space: pre;
    }
</style>
