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
	<div style="top: {y}px; left: {x}px; writing-mode: horizontal-tb;" class="tooltip font-mono">{title}</div>
{/if}

<style>
	.tooltip {
    display: inline-block;
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: absolute;
	}
</style>