<script lang="ts">
  import {config} from "../../config"
  import { iOS } from "../utils"
  import Archive from "svelte-material-icons/Archive.svelte"
  import { themeStore, type ThemeName, themeList } from "$lib/store/Theme"
  import { get } from 'svelte/store'
	import { onDestroy, onMount } from "svelte"
  import { browser } from '$app/env'
  import Brightness4 from "svelte-material-icons/Brightness4.svelte" // Auto
  import Brightness3 from "svelte-material-icons/Brightness3.svelte" // Dark
  import Brightness7 from "svelte-material-icons/Brightness7.svelte" // Bright

  let themeName: ThemeName
  let unsubscribe = themeStore.subscribe(({theme}) => {
    themeName = theme
  })
  // theme = get(themeStore).theme
  const getCurrentTheme = () => {
    return get(themeStore).theme
  }
  const next = (list, current) => {
    const index = list.indexOf(current)
    return list[(index + 1) % list.length]
  }
  const setNextTheme = (currentTheme: ThemeName) => {
    const nextTheme = next(themeList, currentTheme)
    themeStore.set({theme: nextTheme})
  }
  onDestroy(() => {
    if(browser) {
      unsubscribe()
    }
  })
</script>

<style lang="postcss">
</style>

<header>
  <!-- a dummy div to give some space -->
  <div class="pr-8"></div>
  <nav
    class="navbar my-12 md:my-8 md:px-8 shadow-lg bg-primary text-primary-content rounded-box font-sans justify-between"
  >
    <a href="/">
      <div class="flex-1 py-2 my-2 ">
        <span class="text-lg md:text-4xl font-bold font-serif hover:text-primary-focus opacity-90 transition-all duration-500">
          {config.blogName}</span
        >
      </div>
    </a>
    <div>
      <div>
        <button class="btn btn-square btn-ghost">
          <a href="/archive">
            <Archive size="1.5em"/>
          </a>
        </button>
      </div>
      <div>
        <button class="btn btn-square btn-ghost" on:click={()=> setNextTheme(getCurrentTheme())}>
          <!-- svelte-ignore a11y-missing-attribute -->
          {#if themeName == "dark"}
            <Brightness3 size="1.5em"/>
          {:else if themeName == "light"}
            <Brightness7 size="1.5em"/>
          {:else}
            <Brightness4 size="1.5em"/>
          {/if}
        </button>
      </div>
    </div>
  </nav>

  {#if iOS()}
    <div class="alert my-16 mx-4 md:mr-8 md:my-8 flex-row">
      <div class="flex-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2196f3" class="w-6 h-6 mx-2">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
        </svg> 
      </div>
      <div class="flex-2 flex-col">
        <p class="font-serif">致 iOS 用户：由于浏览器的限制，Safari 浏览器无法正确渲染本网页，若遇到代码或者表格无法滚动或标点渲染异常，亦或是按钮渲染错误，请勿惊慌，此乃已知问题。</p>
        <span class="font-serif text-sm">若欲查看源代码请点击 View Source 按钮。</span>
      </div>
    </div>
  {/if}
</header>