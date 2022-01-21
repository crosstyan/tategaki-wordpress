<script lang="ts">
  const dataSelectorName = "data-github-gist",
    githubGistsUrl = "https://gist.github.com",
    scriptElementType = "text/javascript"
  // https://gist.github.com/crosstyan/14ada68b4cea063d40198df7af5152b7
  import { onMount } from "svelte"
  export let gistId
  let isClosed = false
  let isError = false
  let mediaQuery = window.matchMedia("(min-width: 640px)")
  let mainCodeBlock: HTMLDivElement
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
    const gistScriptElement = document.createElement("script")
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
    // https://stackoverflow.com/questions/59629947/how-do-i-load-an-external-js-library-in-svelte-sapper
    const gistScriptElement = createGistScriptElement(gistId)
    document
      .querySelector("[" + dataSelectorName + '="' + gistId + '"]')
      .getElementsByClassName("code-block")[0]
      .appendChild(gistScriptElement)
    gistScriptElement.addEventListener("load", () => {
      isError = false
    })
    gistScriptElement.addEventListener("error", () => {
      isError = true
    })
  })

  const doNothing = () => {}
  const btnClassName =
    "flex btn bg-transparent text-gray-900 hover:text-gray-100 mb-2 px-1 py-3 h-auto w-auto"
</script>

<div class="mx-4">
  <div class="button-group flex font-sans mx-1">
    {#if !isError}
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        on:click|preventDefault={() => (isClosed = !isClosed)}
        class={btnClassName}
        role="button"
        href="#">{isClosed ? "Show" : "Hide"} Gist</a
      >
    {:else}
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        on:click|preventDefault={doNothing}
        class={btnClassName + " text-error border-error"}
        role="button"
        href="#">Loading Error</a
      >
    {/if}
    <!-- TODO: share component with Gist.svelte -->
    <!-- it can be modal window or a standalone window -->
    <a
      class={btnClassName}
      role="button"
      href={`${githubGistsUrl}/${gistId}`}
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
