<script lang="ts">
  import { Tategaki } from "tategaki"
  import { onMount } from "svelte"
  import { Link } from "svelte-navigator"
  import Toc from './Toc.svelte'
  import pangu from "pangu/src/browser/pangu"
  import Prism from "prismjs"
  import { addStyle } from "../utils/utils"
  import {
    parsePuctuation,
    addTooltipInline,
    addCodeBlock,
    addGistComponent,
    addTargetBlank,
  } from "./ParseArticle"
  import "prismjs/plugins/line-numbers/prism-line-numbers"
  import "prismjs/plugins/autolinker/prism-autolinker"
  import "prismjs/plugins/autolinker/prism-autolinker.css"
  import "prismjs/plugins/line-numbers/prism-line-numbers.css"
  export let id: number
  export let title: string
  export let content: string
  export let author = ""
  const defaultDate = new Date(1970, 1, 1)
  export let date: Date = defaultDate
  export let isSingle = false
  let article: HTMLElement
  let toc: HTMLElement

  const dataSelectorName = "data-github-gist"

  function addStyles(element: HTMLElement) {
    addStyle(
      element,
      "blockquote",
      "border-t-4 border-primary p-4 ml-4 font-serif text-sm leading-relaxed"
    )
    addStyle(element, "p", "ml-4")
    addStyle(element, "table", "table-zebra")
    addStyle(
      element,
      "a",
      "underline decoration-accent decoration-2 hover:text-accent transition-colors duration-200"
    )
    addStyle(element, "ul", "list-disc pt-7 ml-4")
    addStyle(element, "ol", "list-decimal pt-7 ml-4")
    addStyle(element, "h1", "text-2xl ml-2 mr-8 font-bold")
    addStyle(element, "h2", "text-2xl ml-2 mr-8 font-bold")
    addStyle(element, "h3", "text-xl ml-2 mr-8 font-bold")
    addStyle(element, "h4", "text-lg ml-2 mr-8 font-bold")
    addStyle(element, "h5", "text-base ml-2 mr-8 font-bold")
    // No prefix: mobile (under 640 px)
    // sm: small break point (640 px)
    // md ................
    addStyle(element, "img", "max-h-[90%] md:max-h-[80%] mx-8 my-auto")
  }

  onMount(async () => {
    // if (isSingle) {
      const headingElements = Array.from(article.querySelectorAll("h2, h3"))
      const tocComponent = new Toc({
        target: toc,
        props: {
          // @ts-ignore
          headingElements: headingElements,
          isForcedOpen: isSingle,
        },
      })
    // }
    parsePuctuation(article)
    addStyles(article)
    addTargetBlank(article)
    pangu.spacingNode(article)
    let tategaki = new Tategaki(article, {
      shouldPcS: true,
      imitatePcS: false,
      imitateTransfromToFullWidth: false,
      shouldRemoveStyle: false,
      convertNewlineCustom: false,
    })
    tategaki.parse()
    addTooltipInline(article)
    addCodeBlock(article, id)
    Prism.highlightAllUnder(article)
    addGistComponent(article, dataSelectorName)
  })
</script>

<article lang="zh-Hant" class="font-serif pr-8 pl-8">
  <header class="ml-8 md:ml-4 text-base-content">
    {#if !isSingle}
      <!-- use replace={false} when possible to prevent back button not going back to the previous page -->
      <Link to="/post/{id}" replace={false}>
        <h1
          class="text-4xl ml-2 font-bold inline-block hover:text-primary transition-colors duration-300 decoration-primary underline decoration-4"
        >
          {@html title}
        </h1>
      </Link>
    {:else}
      <h1 class="text-4xl font-bold">
        {@html title}
      </h1>
    {/if}
    {#if !(author.trim().length === 0)}
      <h2 class="text-base font-normal">{author}</h2>
    {/if}
    {#if !(date === defaultDate)}
      <h2 class="text-sm font-normal">
        {date.toLocaleDateString("zh-CN")}
      </h2>
    {/if}
    <header bind:this={toc} class="overflow-auto w-4/5 md:w-[33%] max-h-full md:max-h-[60%] mr-4"></header>
  </header>
  <content bind:this={article}>
    {@html content}
  </content>
</article>

<style lang="scss">
  content {
    line-height: 1.42;
  }
  // Since I'm using tailwind, I should do it in tailwind's way
</style>
