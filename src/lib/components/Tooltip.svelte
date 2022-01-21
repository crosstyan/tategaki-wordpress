<script lang="ts">
  // https://svelte.dev/repl/dd6754a2ad0547c5b1c1ea37c0293fef?version=3.46.2
	export let title;
	let isHovered = false;
	let x:number;
	let y:number;
	
	function mouseOver(event: MouseEvent) {
		isHovered = true;
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseMove(event: MouseEvent) {
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<span
	on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}>
	<slot />
</span>

{#if isHovered}
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<!-- mobile device/touch device -->
	<div on:mouseover={mouseLeave} style="top: {y}px; left: {x}px; writing-mode: horizontal-tb;" class="tooltip font-mono bg-primary text-primary-content shadow-sm">{title}</div>
{/if}

<style>
	.tooltip {
		text-align: left;
		text-justify: inter-word;
		hyphens: none;
		max-width: 95vw;
    display: inline-block;
		border-radius: 4px;
		padding: 4px;
		position: absolute;
	}
</style>