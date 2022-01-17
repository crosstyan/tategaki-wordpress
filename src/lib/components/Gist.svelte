<script lang="ts">
  const dataSelectorName = "data-github-gist",
    githubGistsUrl = "https://gist.github.com",
    scriptElementType = "text/javascript"
  // https://gist.github.com/crosstyan/14ada68b4cea063d40198df7af5152b7
  import { onMount } from "svelte"
  export let gistId
  let isClosed = false
  let mediaQuery = window.matchMedia("(min-width: 640px)")
  window.addEventListener(
    "resize",
    () => (mediaQuery = window.matchMedia("(min-width: 640px)")),
    true
  )
  // change the value of isClosed automatically when the mediaQuery changes
  $: isClosed = mediaQuery.matches ? false : true
  // From https://github.com/Machy8/async-github-gist
  // window.addEventListener('load', loadGists);
  function createGistScriptElement(gistId: string): HTMLScriptElement {
    var gistScriptElement = document.createElement("script")
    gistScriptElement.setAttribute("type", scriptElementType)
    gistScriptElement.setAttribute("src", githubGistsUrl + "/" + gistId + ".js")
    return gistScriptElement
  }
  onMount(async () => {
    // In a nut shell, the library just use document.currentScript.insertAdjacentHTML() instead of document.write()
    document.write = function (content) {
      document.currentScript?.insertAdjacentHTML("beforebegin", content)
    }
    // I know it has to be a better way to do this
    document
      .querySelector("[" + dataSelectorName + '="' + gistId + '"]')
      .getElementsByClassName("code-block")[0]
      .appendChild(createGistScriptElement(gistId))
  })

  const doNothing = () => {}
  const btnClassName = "flex btn mt-3 px-1 py-3 h-auto w-auto"
</script>

<div class=" mx-2 mt-2">
  <div class="button-group flex">
    <a
      on:click|preventDefault={() => (isClosed = !isClosed)}
      class={btnClassName}
      role="button"
      href="#">{isClosed ? "Show" : "Hide"} Gist</a
    >
    <!-- TODO: implement a function to open another page to show the code -->
    <!-- it can be modal window or a standalone window -->
    <a
      class={btnClassName}
      role="button"
      href="{`${githubGistsUrl}/${gistId}`}"
      target="_blank">View Gist</a
    >
  </div>
  <div
    class="code-block transition-all {isClosed
      ? 'invisible w-0 opacity-0'
      : 'visible opacity-100'}"
  >
    <!-- waiting for code -->
  </div>
</div>

<style lang="postcss">
  /* your styles go here */
</style>
