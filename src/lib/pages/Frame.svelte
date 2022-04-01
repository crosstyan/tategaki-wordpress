<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { browser } from '$app/env'
  import { themeChange } from "theme-change"

  const wheelHandler = (e: WheelEvent) => {
    if (e.deltaX == 0) {
      // console.log(e.target)
      let delta = (e.deltaY || e.detail) >> 10 || 1
      // let delta = ((e.deltaY ) >> 10) || 1;
      delta = delta * 100
      document.documentElement.scrollLeft -= delta
      // safari needs also this
      document.body.scrollLeft -= delta
      e.preventDefault()
    }
  }

  onMount(async () => {
    document.body.addEventListener("wheel", wheelHandler, {
      passive: false,
    })
    themeChange(false)
  })
  onDestroy(() => {
    if (browser) {
      document.body.removeEventListener("wheel", wheelHandler)
      themeChange(true)
    }
  })
</script>

<svelte:head>
  <meta name="viewport"
    content="width=device-width, height=device-height, initial-scale=0.96, viewport-fit=cover, user-scalable=0" />
  <style>
    body {
      /* set vertical-rl to make the initial scroll position
      the most right */
      font-feature-settings: "vkna";
      max-height: 100vh;
      overflow-y: hidden;
      writing-mode: vertical-rl;
    }
    table {
      writing-mode: horizontal-tb;
      display: inline-block;
      overflow: auto;
      max-height: 70vh;
    }
  </style>
</svelte:head>
<main>
  <div class="flex flex-col" id="container">
    <div
      id="article-frame"
      class="font-serif flex flex-col divide-x-2  divide-dashed"
    >
      <slot></slot>
    </div>
  </div>
</main>

<style lang="scss">
  // use "user-scalable" in "viewport" meta
  // to solve user can scale the page
  // A bug/feature in Webkit based browsers

  // https://natclark.com/tutorials/svelte-global-styles/
  main {
    padding: 4rem;
    height: 98vh;
  }


  #article-frame {
    max-height: 70vh;
  }

  @media screen and (max-width: 640px) {
    main {
      padding: 0.5em;
      height: 98vh;
    }
    #article-frame {
      padding-top: 4em;
      max-height: 76vh;
    }
  }

  #container {
    writing-mode: vertical-rl;
    height: 95vh;
    hanging-punctuation: allow-end last;
    text-align: justify;
  }
</style>

