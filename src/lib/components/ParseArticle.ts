  import BlockCode from "./BlockCode.svelte"
  import Gist from "./Gist.svelte"
  import InlineCode from "./InlineCode.svelte"

// https://stackoverflow.com/questions/65198268/what-is-a-svelte-approach-to-showing-a-loader-after-a-time-of-waiting
// TODO: instead of putting the whole thing in the DOM,
// TODO: parse elements in nodejs and cache it to improve performance
// TODO: use promise instead of changing DOM directly
// TODO: feature media
// We can render it first
// https://tategaki.de/dementia-02-20
// https://tategaki.de/%E6%92%AD%E5%AE%A2%E6%98%AF%E4%B8%80%E6%9D%A1%E6%B2%B3-12-05
// https://blog.typlog.com/spring-theme
// https://www.cnblogs.com/yangjiale/p/13925810.html#%E5%AD%90%E9%9B%86%E5%8C%96%E5%AD%97%E4%BD%93%E5%B7%A5%E5%85%B7
// https://efe.baidu.com/blog/fontmin-getting-started/
// https://tate-young.github.io/2020/08/26/css-font-face.html
// We should traverse the DOM and put them in a array then render them
// I'm not sure which one is better


// Not a pure function because it mutates the DOM
export function parsePuctuation(element: HTMLElement) {
  const paragraphElement = Array.from(
    element.getElementsByTagName("p")
  ) as HTMLElement[]
  const listElement = Array.from(element.getElementsByTagName("li"))
  const replaceElement = [...paragraphElement, ...listElement]
  try {
    replaceElement.forEach((elem) => {
      let text = elem.innerHTML
      // use [:ascii:] or [ -~] to match all ascii characters
      // FUCK YOU SAFARI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // https://caniuse.com/js-regexp-lookbehind
      // https://stackoverflow.com/questions/67987645/safari-evaluates-false-if-statement/70195355
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
      // use "new RegExp" instead of literal notation ("/<Your Regex>/") to avoid Safari bug
      // or the RegExp error won't be captured
      const regexPeriod = new RegExp("(?<![ -~])(\\.)+", "g")
      const regexComma = new RegExp("(?<![ -~])(,\\s)+", "g")
      const regexSemicolon = new RegExp("(?<![ -~])(;\\s)+", "g")
      const regexQuestionMark = new RegExp("(?<![ -~])(\\?)+", "g")
      const regexExclamationMark = new RegExp("(?<![ -~])(\\!)+", "g")
      // TODO: fix parentheses in some cases
      // avoid half-width parentheses matching with full-width one
      // which is really ugly
      const regexLeftParentheses = new RegExp("(\\()+(?![ -~])", "g")
      const regexRightParentheses = new RegExp("(?<![ -~])(\\))+", "g")

      text = text.replace(regexPeriod, "。")
      text = text.replace(regexComma, "，")
      text = text.replace(regexQuestionMark, "？")
      text = text.replace(regexExclamationMark, "！")
      text = text.replace(regexSemicolon, "；")
      text = text.replace(regexLeftParentheses, "（")
      text = text.replace(regexRightParentheses, "）")
      text = text.replace(" （", "（")
      text = text.replace("） ", "）")
      text = text.replace("！ ", "！")
      text = text.replace("？ ", "？")
      text = text.replace("。 ", "。")
      elem.innerHTML = text
    })
  } catch (error) {
    // puncutation won't be parsed in Safari
    console.error(error)
  }
}

export function addTooltipInline(element: HTMLElement){
  // COMMENT: I don't know if there is a better way to do this
  // https://svelte.dev/repl/28996f04783542ceafed7cc6a85128b9?version=3.23.0
  // Wrap all preformatted code in BlockCode component
  const inlineCode = element.getElementsByTagName("code")
  Array.from(inlineCode).forEach((code) => {
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
}

export function addCodeBlock(element: HTMLElement){
  // TODO: use slot instead of passing HTMLElement as props
  // See the issues here
  // https://github.com/sveltejs/svelte/issues/2588
  const preformatteds = element.getElementsByTagName("pre")
  Array.from(preformatteds).forEach((pre) => {
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
      },
    })
    pre.remove()
  })
}

export function swapGistScript(element: HTMLElement, dataSelectorName: string) {
  // Find all github gist
  const gists = element.getElementsByTagName("script")
  Array.from(gists).forEach((script) => {
    const src = script.getAttribute("src")
    const gistId = src.split("gist.github.com/")[1].split(".js")[0]
    const parent = script.parentElement
    const newBlock = document.createElement("div")
    newBlock.classList.add("dummy-gist")
    parent.insertBefore(newBlock, script)
    newBlock.setAttribute(dataSelectorName, gistId)
    script.remove()
  })
}


export function addGistComponent(element: HTMLElement, dataSelectorName: string): void {
  // It's strange that svelte won't load the script in @html macro
  swapGistScript(element, dataSelectorName)
  const gistsLoadingElements = element.querySelectorAll(`[${dataSelectorName}]`)
  Array.from(gistsLoadingElements).forEach((gistLoadingElement) => {
    const gistId = gistLoadingElement.getAttribute(dataSelectorName)
    const gist = new Gist({
      target: gistLoadingElement,
      anchor: null,
      props: {
        gistId: gistId,
      },
    })
  })
}
