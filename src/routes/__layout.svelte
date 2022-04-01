<script lang="ts">
  import Nav from "../lib/components/Nav.svelte"
  import Frame from "../lib/pages/Frame.svelte"
	import '../app.css';
</script>

<Nav />

<Frame>
	<main>
		<slot />
	</main>
</Frame>

<style>
</style>
