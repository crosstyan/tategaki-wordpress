<script lang="ts">
  import { Tategaki } from "../tategaki/src/tategaki"
  import { onMount } from "svelte"
  import BlockCode from "./BlockCode.svelte";
  import Gist from "./Gist.svelte"
  export let title = ""
  export let content = ""
  let article:HTMLElement;
  const dataSelectorName = 'data-github-gist'
  onMount(async () => {
    let tategaki = new Tategaki(article, {
      shouldPcS: true,
      imitatePcS: false,
      imitateTransfromToFullWidth: false,
      shouldRemoveStyle: false,
      convertNewlineCustom: false,
    })
    tategaki.parse()
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

    // Find all github gist
    // TODO: script tag is not supported yet
    // script src="https://gist.github.com/crosstyan/973e4843067ab09b04db1881379d8654.js"
    // We should support the script like this
    const gists = article.getElementsByTagName("script")
    Array.from(gists).forEach((script)=>{
      const src = script.getAttribute("src")
      const gistId = src.split("gist.github.com/")[1].split(".js")[0]
      const parent = script.parentElement
      const newBlock = document.createElement("div")
      newBlock.classList.add("dummy-gist")
      parent.insertBefore(newBlock, script)
      newBlock.setAttribute(dataSelectorName, gistId)
      script.remove()
    })
    // It's strange that svelte won't load the script in @html macro
    const gistsLoadingElements = article.querySelectorAll('[data-github-gist]')
    Array.from(gistsLoadingElements).forEach((gistLoadingElement) => {
      const gistId = gistLoadingElement.getAttribute(dataSelectorName)
      const gist = new Gist({
        target: gistLoadingElement,
        anchor: null,
        props: {
          gistId: gistId,
        }
      })
    })
  })
</script>

<article bind:this={article} lang="zh-Hant">
  <h1 class="text-3xl">{title}</h1>
  {@html content}
</article>

<style lang="postcss">
</style>