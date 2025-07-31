<script lang="ts">
    import type {EmojiTheme} from '$lib/emojiThemes';
    import {emojiThemes} from '$lib/emojiThemes';
    import {onMount} from 'svelte';
    import '$lib/font.css';

    const defaultTheme: EmojiTheme = 'noto';
    const textBasedThemes = ['native', 'noto'];
    // const imageBasedThemes = ...

    let {theme, selection, size, emoji}: {
        theme?: EmojiTheme,
        selection?: (emoji: string) => void,
        size?: number,
        emoji: string
    } = $props();

    if (!size) {
        size = 50; // Default size for the emoji
    }
    let sizeVal = $derived(`${size}`);

    if (!theme) {
        theme = defaultTheme;
        onMount(() => {
            const storedTheme = localStorage.getItem('emojiTheme');
            if (storedTheme && emojiThemes.includes(storedTheme as EmojiTheme)) {
                theme = storedTheme as EmojiTheme;
            } else {
                theme = defaultTheme;
            }
        });
    }
</script>

<style>
    button {
        background-color: #3f4045;
        border: 1px solid #02111B;
        border-radius: 0.5rem;
        padding: 0;
        margin: 0.2rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        pointer-events: none; /* Allows the button to capture clicks */
    }
</style>

{#snippet emojiContent()}
    {#if textBasedThemes.includes(theme)}
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width={sizeVal} height={sizeVal}>
            <text x="50" y="50" dominant-baseline="central" text-anchor="middle" font-size="50"
                  class={theme === 'noto' ? 'noto' : ''}>
                {emoji}
            </text>
        </svg>
    {:else}
        Theme {theme} is not supported.
    {/if}
{/snippet}

{#if selection}
    <button onclick={(e) => {
        if (e.target instanceof HTMLElement && e.target.innerText) {
            selection(e.target.innerText);
        }
    }} type="button" class="emoji" style="width: {sizeVal}px; height: {sizeVal}px;">
        {@render emojiContent()}
    </button>
{:else}
    <span class="emoji">
        {@render emojiContent()}
    </span>
{/if}