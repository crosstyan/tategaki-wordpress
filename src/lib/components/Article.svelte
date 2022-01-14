<script lang="ts">
  import { Tategaki } from "../tategaki/src/tategaki"
  import { onMount } from "svelte"
  export let title = ""
  export let content = ""
  let article:HTMLElement;
  onMount(async () => {
    let tategaki = new Tategaki(article, {
      shouldPcS: true,
      imitatePcS: false,
      imitateTransfromToFullWidth: false,
      shouldRemoveStyle: false,
      convertNewlineCustom: false,
    })
    tategaki.parse()
  })
  // TODO I can't fix the bug that IOS user can't scroll
  // the pre or other overflowed element
  // So I decide to give them another option
  // to open another page and display a alert message
</script>

<article bind:this={article} lang="cn">
  <h1 class="text-3xl underline text-gray-500">{title}</h1>
  <p>{@html content}</p>
</article>

<style lang="postcss">
</style>