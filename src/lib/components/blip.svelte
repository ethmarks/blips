<script>
    import { marked } from "marked";
    import { formatDistance } from "date-fns";
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

    function getISODate(date) {
        return date.toISOString();
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

    export function getRelativeDate(createdAtDate, now = Date.now()) {
        const nowDate = new Date(now);

        const distance = formatDistance(createdAtDate, nowDate, {
            addSuffix: false,
            includeSeconds: true,
        });

        return distance
            .replace(/^about /, "")
            .replace(/^over /, "")
            .replace(/^almost /, "")
            .replace(/^less than a minute$/, "now")
            .replace(/^half a minute$/, "now")
            .replace(/^less than \d+ seconds?$/, "now")
            .replace(/^(\d+) minutes?$/, "$1m")
            .replace(/^(\d+) hours?$/, "$1hr")
            .replace(/^(\d+) days?$/, "$1d")
            .replace(/^(\d+) weeks?$/, "$1w")
            .replace(/^(\d+) months?$/, "$1mth")
            .replace(/^(\d+) years?$/, "$1yr");
    }

    $: createdAtDate = new Date(blip._createdAt);
    $: timeDisplay = getRelativeDate(createdAtDate, currentTime);

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

<div class="blip" id={blip._id}>
    <div class="time">
        <time class="relative" datetime={getISODate(createdAtDate)}>
            {timeDisplay}
        </time>
        <time class="absolute" datetime={getISODate(createdAtDate)}>
            {getAbsoluteDate(createdAtDate)}
        </time>
    </div>
    <div class="blip-content">{@html renderMarkdown(blip.content)}</div>
</div>

<style>
    .blip {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0 1rem;
        scroll-margin-top: calc(var(--main-margin-top) + var(--spacing-lg));
        font-size: 1.2rem;
    }

    .blip-content:not(:has(> :only-child:is(blockquote, pre))) {
        background: rgba(255, 255, 255, 0.02);
        padding: 0.7rem 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);

        :target & {
            border: var(--border-accent-2px);
        }
    }

    .blip-content {
        > :global(:first-child) {
            margin-top: 0;
        }
        > :global(:last-child) {
            margin-bottom: 0;
        }

        :global(blockquote) {
            width: auto;
        }
    }
    .time {
        color: #a3a3a3;
        font-size: 0.8rem;
        white-space: pre;
        display: flex;
        justify-content: space-between;
    }
</style>
