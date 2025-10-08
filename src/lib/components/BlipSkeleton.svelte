<script>
    export let animate = true;
    export let lineCount = 2;
    export let lineWidths = [60, 40];

    // Use the provided configuration
    const lines = Array.from({ length: lineCount }, (_, i) => ({
        width: lineWidths[i] || 50, // fallback to 50% if not provided
    }));
</script>

<div class="blip skeleton" class:animate>
    <div class="blip-content">
        {#each lines as line}
            <div class="skeleton-line" style="width: {line.width}%"></div>
        {/each}
    </div>
    <div class="blip-time skeleton-time"></div>
</div>
<hr />

<style>
    .blip {
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
    }

    .skeleton {
        opacity: 0.7;
    }

    .skeleton.animate {
        animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-line {
        height: 1rem;
        background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
        );
        border-radius: 4px;
        margin-bottom: 0.5rem;
    }

    .skeleton-time {
        height: 0.8rem;
        width: 60px;
        background: linear-gradient(
            90deg,
            #444444 25%,
            #222222 50%,
            #444444 75%
        );
        border-radius: 4px;
        align-self: flex-end;
        margin-top: 0.5rem;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.7;
        }
        50% {
            opacity: 0.4;
        }
    }

    .skeleton.animate .skeleton-line,
    .skeleton.animate .skeleton-time {
        animation: shimmer 2s ease-in-out infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }

    .skeleton-line,
    .skeleton-time {
        background-size: 200% 100%;
    }

    hr {
        border: none;
        border-bottom: 2px solid #67d4c5;
    }
</style>
