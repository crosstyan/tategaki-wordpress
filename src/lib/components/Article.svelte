<script lang="ts">
  import { Tategaki } from "../tategaki/src/tategaki"
  import { onMount } from "svelte"
  import BlockCode from "./BlockCode.svelte";
  import Gist from "./Gist.svelte"
  import InlineCode from "./InlineCode.svelte"
  export let title = ""
  export let content = ""
  let article:HTMLElement;
  // TODO: instead of putting the whole thing in the DOM,
  // We should traverse the DOM and put them in a array then render them
  // I'm not sure which one is better
  const dataSelectorName = 'data-github-gist'
  // Not a pure function because it mutates the DOM
  function parsePuctuation(element:HTMLElement) {
    const paragraphElement = Array.from(element.getElementsByTagName("p")) as HTMLElement[]
    const listElement = Array.from(element.getElementsByTagName("li"))
    const replaceElement = [...paragraphElement, ...listElement]
    replaceElement.forEach(elem => {
      let text = elem.innerHTML
      const regexPeriod = /(?<![a-z]|[A-Z]|[\!-9]|\>|\s)(\.)+/g
      const regexComma = /(?<![a-z]|[A-Z]|[\!-9]|\>|\s)(,\s)+/g
      const regexQuestionMark = /(?<![a-z]|[A-Z]|[\!-9])(\?)+/g
      const regexExclamationMark = /(?<![a-z]|[A-Z]|[\!-9])(\!)+/g
      // const regexPara= /(?<![a-z]|[A-Z]|[\!-9])(\)\s)+|(\s\()+(?![a-z]|[A-Z]|[\!-9])/g
      const regexLeftPara = /(\()+(?![a-z]|[A-Z]|[\!-9])/g
      const regexRightPara = /(?<![a-z]|[A-Z]|[\!-9])(\))+/g

      text = text.replace(regexPeriod, "。")
      text = text.replace(regexComma, "，")
      text = text.replace(regexQuestionMark, "？")
      text = text.replace(regexExclamationMark, "！")
      text = text.replace(regexLeftPara, "（")
      text = text.replace(regexRightPara, "）")
      text = text.replace(" （", "（")
      text = text.replace("） ", "）")
      text = text.replace("！ ", "！")
      text = text.replace("？ ", "？")
      text = text.replace("。 ", "。")
      text 
      elem.innerHTML = text
    })
  }
  /// tailwind css
  function addStyle(elem: HTMLElement, tagName:string, style: string) {
    const styles = style.split(" ")
    Array.from(elem.getElementsByTagName(tagName)).forEach(elem => {
      elem.classList.add(...styles)
    })
  }
  onMount(async () => {
    addStyle(article, "a", "underline text-blue-500")
    addStyle(article, "ul", "list-disc pt-7")
    parsePuctuation(article)
    let tategaki = new Tategaki(article, {
      shouldPcS: true,
      imitatePcS: false,
      imitateTransfromToFullWidth: false,
      shouldRemoveStyle: false,
      convertNewlineCustom: false,
    })
    tategaki.parse()
    // Wrap all preformatted code in BlockCode component
    const inlineCode = article.getElementsByTagName("code")
    Array.from(inlineCode).forEach(code => {
      const parent = code.parentElement
      if (parent.tagName !== "PRE") {
        const dummy = document.createElement("span")
        parent.insertBefore(dummy, code)
        const inlineCodeComponent = new InlineCode({
          target: dummy,
          props: {
            codeElem: code,
          },
        })
        code.remove()
      }
    })
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
    // TODO: support configure the url of gist
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

<style lang="scss">
  // Since I'm using tailwind, I should do it in tailwind's way
</style>