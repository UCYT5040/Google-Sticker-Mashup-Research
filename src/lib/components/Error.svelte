<script lang="ts">
    import type {EmojiTheme} from '$lib/emojiThemes';
    import {emojiThemes} from '$lib/emojiThemes';
    import {onMount} from 'svelte';
    import '$lib/font.css';
    import Emoji from '$lib/components/Emoji.svelte';

    let {size}: {
        size?: number
    } = $props();

    if (!size) {
        size = 50; // Default size for the emoji
    }
</script>

<style>
    svg {
        width: 15rem;
        height: 15rem;
    }
</style>

<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <foreignObject height="50" width="50">
        <Emoji emoji="❌" size={50}/>
    </foreignObject>
</svg>