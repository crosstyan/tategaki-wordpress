<script lang="ts">
	import { setTheme } from "$lib/utils"
	import { onDestroy, onMount } from "svelte"
  import { browser } from '$app/env'
	import { themeStore } from "$lib/store/Theme"
	import { get } from "svelte/store"

  // copy and paste from __layout.svelte
	let unsubscribe = themeStore.subscribe(({theme}) => {
		setTheme(theme)
	})

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
<main>
  <slot />
</main>