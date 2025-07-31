<script lang="ts">
    import EmojiPicker from '$lib/components/EmojiPicker.svelte';
    import Loading from '$lib/components/Loading.svelte';
    import Emoji from '$lib/components/Emoji.svelte';
    import Error from '$lib/components/Error.svelte';
    import type { PageProps } from './$types';

    let {data}: PageProps = $props();

    let emojiA = $state('');
    let emojiB = $state('');
    // ? emojis as defaults
    let defaultEmojiA = $derived(emojiA || '❔');
    let defaultEmojiB = $derived(emojiB || '❔');
    let result: string | null = $state(null);
    let pendingResult: string | null = $state(null);
    let done: boolean = $state(false);

    function selection(emoji: string) {
        if ((emojiA === '' && emojiB === '') || (emojiA !== '' && emojiB !== '')) {
            emojiA = emoji;
            emojiB = '';
        } else if (emojiB === '') {
            emojiB = emoji;
        }
    }

    async function getResult() {
        done = false;
        if (emojiA && emojiB) {
            // Clear previous result
            result = null;
            // Get `/sticker` route with params emojiA and emojiB
            const url = `/sticker?emojiA=${encodeURIComponent(emojiA)}&emojiB=${encodeURIComponent(emojiB)}`;
            const response = await fetch(url);
            if (response.status === 200) {
                const data = await response.json();
                if (!data || !('image' in data)) {
                    alert('Invalid response from server');
                    return;
                }
                pendingResult = data.image;
                if (!pendingResult) {
                    done = true;
                    return;
                }
                const image = new Image();
                image.onload = () => {
                    done = true;
                };
                // TODO: Handle errors in image loading
                image.src = pendingResult;
            } else {
                pendingResult = null;
                done = true;
            }
        } else {
            pendingResult = null;
            done = true;
        }
    }

    function complete() {
        if (pendingResult) {
            result = pendingResult;
            pendingResult = null;
        }
    }

    $effect(() => {
        if (emojiA && emojiB) {
            getResult();
        } else {
            result = null;
        }
    });
</script>

<style>
    :global(body) {
        background-color: #30292F;
        color: #f1f1f1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
    }

    .app {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: calc(100% - 4rem);
        height: 100vh;
        margin: 0 2rem;
    }

    .result img {
        width: 15rem;
    }

    .formula {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 2;
        font-size: 4rem;
    }

    .result {
        flex-grow: 3;
    }

    .empty {
        width: 15rem;
        height: 15rem;
    }

    .title {
        font-size: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0;
    }

    .star-button {
        margin-left: 1rem;
    }
</style>

<h1 class="title">
    <Emoji emoji="🔪" size={64}/>
    Emoji Chef
    <span class="star-button"><a aria-label="Star UCYT5040/Google-Emoji-Kitchen-Research on GitHub" class="github-button"
       data-color-scheme="no-preference: dark; light: light; dark: dark;" data-icon="octicon-star" data-show-count="true"
       data-size="large" href="https://github.com/UCYT5040/Google-Emoji-Kitchen-Research">Star</a></span>
</h1>

<div class="app">
    <EmojiPicker selection={selection} emojisWithStickers={data.emojisWithStickers}/>

    <div class="formula">
        <Emoji emoji={defaultEmojiA} size={150}/>
        +
        <Emoji emoji={defaultEmojiB} size={150}/>
        =
    </div>

    <div class="result">
        {#if result && !pendingResult}
            <img src={result} alt="Resulting sticker"/>
        {:else if emojiA && emojiB && done && !pendingResult}
            <Error></Error>
        {:else if emojiA && emojiB}
            <Loading emojiA={emojiA} emojiB={emojiB} done={done} complete={complete}/>
        {:else}
            <div class="empty"></div>
        {/if}
    </div>
</div>
