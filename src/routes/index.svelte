<script lang="ts">
  import MultiplePosts from "../lib/pages/MultiplePosts.svelte"
  import SinglePost from "../lib/pages/SinglePost.svelte"
  import Archive from "../lib/pages/Archive.svelte"
  import ErrorPrompt from "../lib/components/ErrorPrompt.svelte"
  import CodeView from "../lib/pages/CodeView.svelte"
  import { onMount } from "svelte"
  import { config } from "../config"
  import { themeChange } from "theme-change"
  // NOTE: about theme color
  // https://github.com/saadeghi/daisyui/blob/master/src/colors/themes.js

  onMount(async () => {
    themeChange(false)
  })
</script>

<svelte:head>
  <title>{config.blogName}</title>
</svelte:head>
  <MultiplePosts />

<style lang="scss">
</style>
