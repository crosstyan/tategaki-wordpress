<script lang="ts">
  import Nav from "../lib/components/Nav.svelte"
  import Frame from "../lib/pages/Frame.svelte"
	import '../app.css'
	import { navigating } from "$app/stores"
  import { Jumper } from "svelte-loading-spinners"
  import { colors } from "@/lib/styles/sharedStyle"
	import { onDestroy, onMount } from "svelte"
  import { browser } from '$app/env'
	import { themeStore, type ThemeName } from "$lib/store/Theme"

	const setTheme = (themeName: ThemeName) => {
		if (browser){
			const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
			let theme : ThemeName = (themeName == "auto") ? ((isDark) ? 'dark' : 'light') : themeName
			document.documentElement.setAttribute("data-theme", theme)
		}}

	let unsubscribe = themeStore.subscribe(({theme}) => {
		setTheme(theme)
	})

	onDestroy(() => {
		if(browser) {
			unsubscribe()
		}
	})

</script>

<Nav />

<Frame>
	<!-- https://stackoverflow.com/questions/70826183/sveltekit-load-function-issue -->
	{#if $navigating}
		<main class="flex justify-center">
			<Jumper color={colors.loading} />
		</main>
	{:else}
		<main>
			<slot />
		</main>
	{/if}
</Frame>

<style>
</style>
