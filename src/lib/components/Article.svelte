<script lang="ts">
  import { Tategaki } from "../tategaki/src/tategaki"
  import { onMount } from "svelte"
  import BlockCode from "./BlockCode.svelte";
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
    const codes = article.getElementsByTagName("code")
    // Wrap all preformatted code in BlockCode component
    const preformatteds = article.getElementsByTagName("pre")
    // TODO: use slot instead of passing HTMLElement as props
    // See the issues here
    // https://github.com/sveltejs/svelte/issues/2588
    Array.from( preformatteds ).forEach((pre)=>{
      const parent = pre.parentElement
      const newBlock = document.createElement("div")
      newBlock.classList.add("dummy-pre-code")
      // This method is kind of tidious.
      // But I can't think of a better way
      parent.insertBefore(newBlock, pre)
      const block = new BlockCode({
        target: newBlock,
        anchor: null, // the component renders in the target directly
        props: {
          code: pre,
        }
      })
      pre.remove()
    })
  })
</script>

<article bind:this={article} lang="cn">
  <h1 class="text-3xl">{title}</h1>
  {@html content}
</article>

<style lang="postcss">
</style>