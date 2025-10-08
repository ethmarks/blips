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

    function getRelativeDate(createdAtDate, now = currentTime) {
        const diffMinutes = (now - createdAtDate.getTime()) / 60000;
        const diffHours = diffMinutes / 60;
        const diffDays = diffHours / 24;
        const diffWeeks = diffDays / 7;
        const diffMonths = diffDays / 30;
        const diffYears = diffDays / 365;

        // < 1 minute: "now"
        if (diffMinutes < 1) {
            return "now";
        }

        // < 1 hour: "4m"
        if (diffHours < 1) {
            return `${Math.floor(diffMinutes)}m`;
        }

        // < 1 day (must be *same* day): "4hr 4m"
        const nowDate = new Date(now);
        const isSameDay =
            createdAtDate.getDate() === nowDate.getDate() &&
            createdAtDate.getMonth() === nowDate.getMonth() &&
            createdAtDate.getFullYear() === nowDate.getFullYear();

        if (diffDays < 1 && isSameDay) {
            const hours = Math.floor(diffHours);
            const remainingMinutes = Math.floor(diffMinutes % 60);
            if (remainingMinutes === 0) {
                return `${hours}hr`;
            }
            return `${hours}hr ${remainingMinutes}m`;
        }

        // < 2 days: "yesterday"
        if (diffDays < 2) {
            return "yesterday";
        }

        // < 1 week: "4d"
        if (diffWeeks < 1) {
            return `${Math.floor(diffDays)}d`;
        }

        // < 2 week: "last week"
        if (diffWeeks < 2) {
            return "last week";
        }

        // < 1 month: "4w"
        if (diffMonths < 1) {
            return `${Math.floor(diffWeeks)}w`;
        }

        // < 2 month: "last month"
        if (diffMonths < 2) {
            return "last month";
        }

        // < 1 year: "4mth"
        if (diffYears < 1) {
            return `${Math.floor(diffMonths)}mth`;
        }

        // < 2 year: "last year"
        if (diffYears < 2) {
            return "last year";
        }

        // else: "4yr"
        return `${Math.floor(diffYears)}yr`;
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
        text-align: left;
        white-space: pre;
    }
</style>
