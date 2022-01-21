<script lang="ts">
  import { onMount } from "svelte"
  import {CopyInfo, copyTextToClipboard} from "../utils/clipboard"
  // Modified autoloader which use CDN
  // the o../utils/prism-autoloader
  // https://github.com/PrismJS/prism/blob/master/plugins/autoloader/prism-autoloader.js
  import "../utils/prism-autoloader"

  let isCopied = false
  const copyInfo:CopyInfo = {
    getText: ()=>{
      return code.textContent || ""
    },
    success: ()=>{isCopied = true},
    error: (reason)=>{
      console.error("Copy error:", reason)
    }
  }
  
  // Expect the element to be
  // <pre>
  //   <code class="language-javascript">
  //     var foo = 'bar'; // Code here
  //   </code>
  // </pre>
  export let code: HTMLElement
  let language = "language-none"
  let isClosed = false
  let mediaQuery = window.matchMedia('(min-width: 640px)')
  window.addEventListener('resize', ()=>(mediaQuery = window.matchMedia('(min-width: 640px)')), true);
  // change the value of isClosed automatically when the mediaQuery changes
  $: isClosed = mediaQuery.matches ? false : true
  // TODO I can't fix the bug that IOS user can't scroll
  // the pre or other overflowed element
  // So I decide to give them another option
  // to open another page and display a alert message
  onMount(() => {
    // console.log("Plugin", Prism.plugins.lineNumbers)
    // get the language of the code
    try {
      code.getElementsByTagName("code").item(0).classList.forEach(className => {
        if (className.startsWith("language-")) {
          language = className
        }
      code.classList.add("line-numbers")
      })
    } catch (err) {
      console.log(err)
    }
  })
  const doNothing = () => {}
  // TODO: why I don't let the button become a standalone component?
  // TODO: share style with inlineCode.svelte
  const btnClassName = "flex btn bg-transparent text-gray-900 hover:text-gray-100 mb-2 px-1 py-3 h-auto w-auto"
</script>

<!-- I know I should have use slot -->
<div class="mx-4">
  <div class="button-group flex font-sans mx-1">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
      on:click|preventDefault={() => (isClosed = !isClosed)}
      class="{btnClassName}"
      role="button"
      href="#">{isClosed ? "Show" : "Hide"} Code</a
    >
    <!-- TODO: implement a function to open another page to show the code -->
    <!-- it can be modal window or a standalone window -->
    {#if !isClosed}
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        on:click|preventDefault={doNothing}
        class="{btnClassName}"
        role="button"
        href="#">View Source</a
      >
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        on:click|preventDefault={()=>{
          copyTextToClipboard(copyInfo)
        }}
        class="{btnClassName}"
        role="button"
        href="#">{isCopied ? "Copied" : "Copy"} </a
      >
    {/if}
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
      on:click|preventDefault={doNothing}
      class="{btnClassName + " font-mono lowercase"} "
      role="button"
      href="#">{language}</a
    >
  </div>
  <div
    class="code-block transition-all {isClosed
      ? 'invisible w-0 opacity-0'
      : 'visible opacity-100'}"
  >
    {@html code.outerHTML}
  </div>
</div>

<style lang="postcss">
  @import "./pre";
  @import "../utils/prism-github";
</style>
