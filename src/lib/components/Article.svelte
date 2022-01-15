<script lang="ts">
  import { Tategaki } from "../tategaki/src/tategaki"
  import { onMount } from "svelte"
  import BlockCode from "./BlockCode.svelte";
  import Prism from "prismjs"
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
    // Format all code, including inline and preformatted
    Array.from(codes).forEach((code)=>{
      Prism.highlightElement(code)
    })
    // Wrap all preformatted code in BlockCode component
    // TODO: maybe I should move it to BlockCode
    const preformatteds = article.getElementsByTagName("pre")
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
  // TODO I can't fix the bug that IOS user can't scroll
  // the pre or other overflowed element
  // So I decide to give them another option
  // to open another page and display a alert message
</script>

<article bind:this={article} lang="cn">
  <h1 class="text-3xl underline text-gray-500">{title}</h1>
  {@html content}
</article>

<style lang="postcss">
</style>