<script lang="ts">
  import { Tategaki } from "tategaki"
  import { onMount } from "svelte"
  import BlockCode from "./BlockCode.svelte"
  import Gist from "./Gist.svelte"
  import InlineCode from "./InlineCode.svelte"
  import pangu from "pangu/src/browser/pangu"
  export let title;
  export let content;
  let article:HTMLElement;
  // TODO: Add a loading screen since pasring all of these takes too long
  // https://stackoverflow.com/questions/65198268/what-is-a-svelte-approach-to-showing-a-loader-after-a-time-of-waiting
  // TODO: instead of putting the whole thing in the DOM,
  // TODO: parse elements in nodejs and cache it to improve performance
  // TODO: use promise instead of changing DOM directly
  // We can render it first
  // https://tategaki.de/dementia-02-20
  // https://tategaki.de/%E6%92%AD%E5%AE%A2%E6%98%AF%E4%B8%80%E6%9D%A1%E6%B2%B3-12-05
  // https://blog.typlog.com/spring-theme
  // https://www.cnblogs.com/yangjiale/p/13925810.html#%E5%AD%90%E9%9B%86%E5%8C%96%E5%AD%97%E4%BD%93%E5%B7%A5%E5%85%B7
  // https://efe.baidu.com/blog/fontmin-getting-started/
  // https://tate-young.github.io/2020/08/26/css-font-face.html
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
      // use [:ascii:] or [ -~] to match all ascii characters
      const regexPeriod = /(?<![ -~])(\.)+/g
      const regexComma = /(?<![ -~])(,\s)+/g
      const regexSemicolon = /(?<![ -~])(;\s)+/g
      const regexQuestionMark = /(?<![ -~])(\?)+/g
      const regexExclamationMark = /(?<![ -~])(\!)+/g
      // const regexPara= /(?<![a-z]|[A-Z]|[\!-9])(\)\s)+|(\s\()+(?![a-z]|[A-Z]|[\!-9])/g
      const regexLeftPara = /(\()+(?![ -~])/g
      const regexRightPara = /(?<![ -~])(\))+/g

      text = text.replace(regexPeriod, "。")
      text = text.replace(regexComma, "，")
      text = text.replace(regexQuestionMark, "？")
      text = text.replace(regexExclamationMark, "！")
      text = text.replace(regexSemicolon, "；")
      text = text.replace(regexLeftPara, "（")
      text = text.replace(regexRightPara, "）")
      text = text.replace(" （", "（")
      text = text.replace("） ", "）")
      text = text.replace("！ ", "！")
      text = text.replace("？ ", "？")
      text = text.replace("。 ", "。")
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
    // TODO: table of content
    // TODO: build a interface to handle all the style
    // TODO: support changing themes and color
    addStyle(article, "blockquote", "border-t-4 border-black p-4 ml-4 font-serif text-sm leading-relaxed")
    addStyle(article, "p", "ml-4")
    addStyle(article, "table", "table-zebra")
    addStyle(article, "a", "underline decoration-blue-500 decoration-2 hover:text-blue-500 transition-colors duration-200")
    addStyle(article, "ul", "list-disc pt-7 ml-4")
    addStyle(article, "ol", "list-decimal pt-7 ml-4")
    addStyle(article, "h1", "text-2xl ml-2 mr-8 font-bold")
    addStyle(article, "h2", "text-2xl ml-2 mr-8 font-bold")
    addStyle(article, "h3", "text-xl ml-2 mr-8 font-bold")
    addStyle(article, "h4", "text-lg ml-2 mr-8 font-bold")
    addStyle(article, "h5", "text-base ml-2 mr-8 font-bold")
    // No prefix: mobile (under 640 px)
    // sm: small break point (640 px)
    // md ................
    addStyle(article, "img", "max-h-[90%] md:max-h-[80%] mx-8 my-auto")
    parsePuctuation(article)
    pangu.spacingNode(article)
    let tategaki = new Tategaki(article, {
      shouldPcS: true,
      imitatePcS: false,
      imitateTransfromToFullWidth: false,
      shouldRemoveStyle: false,
      convertNewlineCustom: false,
    })
    tategaki.parse()
    // TODO: latin class tooltip
    // COMMENT: I don't know if there is a better way to do this
    // https://svelte.dev/repl/28996f04783542ceafed7cc6a85128b9?version=3.23.0
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

<article lang="zh-Hant" class="font-serif pr-8 mr-8">
  <h1 class="text-4xl font-bold ml-16">{title}</h1>
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