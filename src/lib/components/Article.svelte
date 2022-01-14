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
</script>

<article bind:this={article}>
  <h1 class="text-3xl underline text-gray-500">{title}</h1>
  <p>{@html content}</p>
</article>

<style lang="postcss">
</style>