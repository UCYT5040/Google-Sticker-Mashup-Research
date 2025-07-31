<script lang="ts">
    import Emoji from '$lib/components/Emoji.svelte';
    import {onDestroy, onMount} from 'svelte';

    let {emojiA, emojiB, done, complete}: {
        emojiA: string,
        emojiB: string,
        done: boolean,
        complete: () => void
    } = $props();

    let rotateA = $state(0);
    let rotateB = $state(180);
    let xA = $state(25);
    let xB = $state(75);
    let yA = $state(25);
    let yB = $state(75);
    let opacity = $state(1);
    let size = $state(50);

    let centerXA = $derived(`${xA - (size / 2)}`);
    let centerYA = $derived(`${yA - (size / 2)}`);
    let centerXB = $derived(`${xB - (size / 2)}`);
    let centerYB = $derived(`${yB - (size / 2)}`);

    let transformA = $derived(`rotate(${rotateA} ${xA} ${yA})`);
    let transformB = $derived(`rotate(${rotateB} ${xB} ${yB})`);
    let xPosA = $derived(`${centerXA}`);
    let xPosB = $derived(`${centerXB}`);
    let yPosA = $derived(`${centerYA}`);
    let yPosB = $derived(`${centerYB}`);
    let opacityVal = $derived(`${opacity}`);
    let sizeVal = $derived(`${size}`);

    let animationStep = 0; // 0 to 1
    let animationDuration = 2000; // 2 seconds
    let lastFrame: number | null = null;
    let doneAnimation = 0;

    function easeInOutCubic(t: number) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function fromTo(value: number, to: number, step: number) {
        return value + (to - value) * step;
    }

    let destroyed = false;

    function frame() {
        if (lastFrame === null) {
            lastFrame = performance.now();
        }

        const now = performance.now();
        const delta = now - lastFrame;
        lastFrame = now;

        animationStep += delta / animationDuration;

        while (animationStep > 1) {
            animationStep -= 1; // Loop the animation
        }

        // Apply easing to the animation step
        const easedStep = easeInOutCubic(animationStep);

        // Calculate the current state based on the eased animation step
        if (easedStep < 0.25) {
            if (done && doneAnimation == 0) doneAnimation = 1;
            else if (doneAnimation == 2) complete();
            const step = easedStep / 0.25;
            rotateA = fromTo(0, 180, step);
            rotateB = fromTo(180, 360, step);
            yA = fromTo(25, 75, step);
            yB = fromTo(75, 25, step);
        } else if (easedStep < 0.5) {
            const step = (easedStep - 0.25) / 0.25;
            if (doneAnimation == 1 || doneAnimation == 2) {
                rotateA = fromTo(180, 45, step);
                rotateB = fromTo(360, 135, step);
                xA = fromTo(25, 50, step);
                xB = fromTo(75, 50, step);
                yA = fromTo(75, 50, step);
                yB = fromTo(25, 50, step);
                opacity = fromTo(1, 0.5, step);
                size = fromTo(50, 100, step);
                doneAnimation = 2;
            } else {
                rotateA = fromTo(180, 540, step);
                rotateB = fromTo(0, 360, step);
                yA = 75;
                yB = 25;
            }
        } else if (easedStep < 0.75) {
            if (done && doneAnimation == 0) doneAnimation = 1;
            else if (doneAnimation == 2) complete();
            const step = (easedStep - 0.5) / 0.25;
            rotateA = fromTo(180, 0, step);
            rotateB = fromTo(360, 180, step);
            yA = fromTo(75, 25, step);
            yB = fromTo(25, 75, step);
        } else {
            const step = (easedStep - 0.75) / 0.25;
            if (doneAnimation == 1 || doneAnimation == 2) {
                rotateA = fromTo(360, 135, step);
                rotateB = fromTo(180, 45, step);
                xA = fromTo(25, 50, step);
                xB = fromTo(75, 50, step);
                yA = fromTo(25, 50, step);
                yB = fromTo(75, 50, step);
                opacity = fromTo(1, 0.5, step);
                size = fromTo(50, 100, step);
                doneAnimation = 2;
            } else {
                rotateA = fromTo(0, 360, step);
                rotateB = fromTo(180, 540, step);
                yA = 25;
                yB = 75;
            }

        }

        if (!destroyed) requestAnimationFrame(frame);
    }

    onMount(() => {
        lastFrame = performance.now();
        requestAnimationFrame(frame);
    });

    onDestroy(() => {
        destroyed = true;
    });
</script>

<style>
    .emoji {
        font-size: 2em;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        width: 15rem;
        height: 15rem;
    }
</style>

<svg height="100" viewBox="0 0 100 100" width="100" xmlns="http://www.w3.org/2000/svg">
    <foreignObject class="emoji" height={sizeVal} opacity={opacityVal} transform={transformA} width={sizeVal} x={xPosA}
                   y={yPosA}>
        <Emoji emoji={emojiA} size={size}/>
    </foreignObject>
    <foreignObject class="emoji" height={sizeVal} opacity={opacityVal} transform={transformB} width={sizeVal} x={xPosB}
                   y={yPosB}>
        <Emoji emoji={emojiB} size={size}/>
    </foreignObject>
</svg>