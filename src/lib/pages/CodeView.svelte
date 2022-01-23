<script lang="ts">
  import Prism from "prismjs"
  import "prismjs/plugins/line-numbers/prism-line-numbers"
  import "prismjs/plugins/autolinker/prism-autolinker"
  import "prismjs/plugins/autolinker/prism-autolinker.css"
  import "prismjs/plugins/line-numbers/prism-line-numbers.css"
  import { onMount } from "svelte"
  // your script goes here
  export let code: string
  let codeSection: HTMLElement

  onMount(async () => {
    Prism.highlightAllUnder(codeSection)
  })
</script>

<svelte:head>
  <style>
    body {
      writing-mode: horizontal-tb;
      max-height: none;
      overflow-y: auto;
    }
  </style>
</svelte:head>

<div bind:this={codeSection} class="bg-base-300">
  {code}
</div>

<!-- markup (zero or more items) goes here -->

<style lang="postcss">
  @import "../styles/prism-github";
</style>
