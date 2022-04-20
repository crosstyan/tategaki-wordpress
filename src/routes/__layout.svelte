<script lang="ts">
  import Nav from "../lib/components/Nav.svelte"
  import Frame from "../lib/pages/Frame.svelte"
	import '../app.css'
	import { navigating } from "$app/stores"
	import { get } from "svelte/store"
  import { Jumper } from "svelte-loading-spinners"
  import { colors } from "@/lib/styles/sharedStyle"
	import { setTheme } from "$lib/utils"
	import { onDestroy, onMount } from "svelte"
  import { browser } from '$app/env'
	import { themeStore, type ThemeName } from "$lib/store/Theme"

	// This one is for monitor the button click
	let unsubscribe = themeStore.subscribe(({theme}) => {
		setTheme(theme)
	})

	// This one is used to monitor the theme changed by system
	const changeTheme = () => {
		const themeName = get(themeStore).theme
		setTheme(themeName)
	}

	onMount(() => {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeTheme)
	})

	onDestroy(() => {
		if(browser) {
			window.removeEventListener('change', changeTheme)
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
