<script lang="ts">
    import dataByGroup from 'unicode-emoji-json/data-by-group.json';
    import Emoji from '$lib/components/Emoji.svelte';

    /* Single emoji that best represents the category */
    const categoryEmojis = {
        'smileys_emotion': '😀',
        'people_body': '👍',
        'animals_nature': '🐶',
        'food_drink': '🍕',
        'travel_places': '🌍',
        'activities': '⚽',
        'objects': '📱',
        'symbols': '❤️',
        'flags': '🏁',
        'default': '❓'
    };

    let categories: Record<string, typeof dataByGroup[0]> = {};
    for (const group of dataByGroup) {
        categories[group.slug] = group;
    }

    let category: string | null = $state(Object.keys(categoryEmojis)[0]);

    let {selection, emojisWithStickers}: { selection: (emoji: string) => void, emojisWithStickers: string[] } = $props();

    let search = $state('');
    let searchResults = $state<string[]>([]);

    // To prevent lag when typing in the search input, ensure a small delay has passed before searching
    let typingEndsAt: number | null = null;
    const typingDelay = 300; // milliseconds

    function typingTimeout() {
        if (typingEndsAt && Date.now() >= typingEndsAt && search) {
            searchResults = Object.values(categories)
                .flatMap(category => category.emojis)
                .filter(emoji => emoji.name.includes(search))
                .map(emoji => emoji.emoji);
        }
    }

    function onInput(event: any) {
        typingEndsAt = Date.now() + typingDelay;
        setTimeout(typingTimeout, typingDelay);
    }

    $effect(() => {
        if (!search) {
            searchResults = [];
            category = Object.keys(categoryEmojis)[0]; // Reset to the first category when search is cleared
        } else {
            category = null;
        }
    });

    let emojiLists: {[key: string]: HTMLDivElement} = {};
    let emojisContainer: HTMLDivElement;
    let scrollingProgrammatically = false;

    function selectCategory(newCategory: string) {
        if (newCategory !== category) {
            category = newCategory;
            // Scroll to the top of the emoji list for the selected category
            const emojiList = emojiLists[category];
            if (emojiList) {
                scrollingProgrammatically = true;
                emojiList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    scrollingProgrammatically = false;
                }, 500); // Estimated time for the scroll to complete
            } else {
                console.warn(`Emoji list for category "${newCategory}" not found.`);
            }
        }
    }

    function scrollLists() {
        if (scrollingProgrammatically) return; // Ignore scroll events triggered by programmatic scrolling
        const containerTop = emojisContainer.getBoundingClientRect().top;
        for (const group of dataByGroup) {
            const emojiList = emojiLists[group.slug];
            const elementTop = emojiList.getBoundingClientRect().top;
            if (elementTop >= containerTop && elementTop < containerTop + emojisContainer.clientHeight) {
                if (category !== group.slug) {
                    category = group.slug;
                }
                break;
            }
        }
    }

    let filterEmojis = $state(true);

    function filtered(emojis: (string | { emoji: string, [key: string]: any })[]) {
        if (!filterEmojis) return emojis;
        return emojis.filter(emoji => {
            if (typeof emoji === 'string') {
                return emojisWithStickers.includes(emoji);
            }
            return emojisWithStickers.includes(emoji.emoji);
        });
    }

    console.log(emojisWithStickers);
</script>

<style>
    .emoji-picker {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: #323335;
        border-radius: 0.5rem;
        width: fit-content;
    }

    .emoji-groups {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .category-button {
        color: #fff;
        background-color: #3f4045;
        border: 1px solid #02111B;
        border-radius: 0.5rem;
        cursor: pointer;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-evenly;
        gap: 0.5rem;
        width: 10rem;
    }

    .emojis {
        height: 60vh;
        overflow-y: auto;
        width: 32rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .emoji-list {
        width: 28rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
        gap: 0.2rem;
        padding: 1rem;
    }

    .search-input {
        width: 28rem;
        padding: 0.5rem;
        border: 1px solid #02111B;
        border-radius: 0.5rem;
        background-color: #3f4045;
        color: #fff;
    }
</style>

<div class="emoji-picker">
    <div class="emoji-groups">
        <label for="filtered">
            <input type="checkbox" id="filtered" bind:checked={filterEmojis} />
            Working emojis
        </label>
        {#each dataByGroup as group}
            <button type="button" class="category-button" onclick={() => selectCategory(group.slug)} data-slug={group.slug}>
                <Emoji emoji={categoryEmojis[group.slug] || categoryEmojis.default}/>
                {#if category === group.slug}
                    <strong>
                        {group.name}
                    </strong>
                {:else}
                    <span>{group.name}</span>
                {/if}
            </button>
        {/each}
    </div>

    <div class="emojis" bind:this={emojisContainer} onscroll={scrollLists}>
        <input type="text" placeholder="Search emojis..." bind:value={search} class="search-input"
        oninput={onInput}/>

        {#if filtered(searchResults).length > 0}
            <div class="emoji-list">
                {#each filtered(searchResults) as emoji}
                    <Emoji emoji={emoji} size={50} selection={selection}/>
                {/each}
            </div>
        {:else}
            {#each Object.values(categories) as category}
                <div class="emoji-list" bind:this={emojiLists[category.slug]}>
                    {#each filtered(category.emojis) as emoji}
                        <Emoji emoji={emoji.emoji} size={50} selection={selection}/>
                    {/each}
                </div>
            {/each}
        {/if}
    </div>

</div>
