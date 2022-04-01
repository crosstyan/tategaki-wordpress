<script lang="ts">
  import Prism from "prismjs"
  import "prismjs/plugins/line-numbers/prism-line-numbers.js"
  import "prismjs/plugins/autolinker/prism-autolinker.js"
  import "prismjs/plugins/autolinker/prism-autolinker.css"
  import "prismjs/plugins/line-numbers/prism-line-numbers.css"
  import "@/lib/utils/prism-autoloader"
  import { onMount } from "svelte"
  import { get } from 'svelte/store'
  import { codeStore } from '@/lib/store/Code'
  import { styles } from '@/lib/styles/sharedStyle'
  import { addStyle } from "@/lib/utils"
  // your script goes here
  let code: string
  let id: number
  let codeSection: HTMLElement
  code = get(codeStore).content
  id = get(codeStore).fromId
  // TODO: assign a ID to block code

  onMount(async () => {
    Prism.highlightAllUnder(codeSection)
    addStyle(codeSection, 'pre', 'bg-base-300')
  })
</script>

<svelte:head>
  <meta name="viewport"
    content="user-scalable=1" />
  <style>
    body {
      writing-mode: horizontal-tb;
      overflow: auto;
      max-height: none;
      max-width: none;
      width: fit-content;
      height: fit-content;
    }
  </style>
</svelte:head>

<div id="codeSection" bind:this={codeSection}>
  {@html code}
</div>
<!-- button group -->
<div class="btn-group mx-3 my-4">
  <button class="{styles.horizontalButton}">
    <a href={`/post/${id}`}>Back to Post</a>
  </button>
</div>

<!-- markup (zero or more items) goes here -->

<style lang="postcss">
  @import "@/lib/styles/prism-github";
</style>
