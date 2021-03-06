<script lang="ts">
  import { onMount } from "svelte"
  import { copyTextToClipboard, type CopyInfo } from "../utils/clipboard"
  // Modified autoloader which use CDN
  // the o../utils/prism-autoloader
  // https://github.com/PrismJS/prism/blob/master/plugins/autoloader/prism-autoloader.js
  import "../utils/prism-autoloader"
  import { addStyle, doNothing } from "../utils"
  import { styles } from '../styles/sharedStyle'
  import { codeStore } from '../store/Code'

  let isCopied = false
  const copyInfo: CopyInfo = {
    getText: () => {
      return code.textContent || ""
    },
    success: () => {
      isCopied = true
    },
    error: (reason) => {
      console.error("Copy error:", reason)
    },
  }

  // Expect the element to be
  // <pre>
  //   <code class="language-javascript">
  //     var foo = 'bar'; // Code here
  //   </code>
  // </pre>
  export let code: HTMLElement
  export let postId: number
  let codeContainer: HTMLElement
  let language = "language-none"
  let isClosed = false
  let mediaQuery = false
  // change the value of isClosed automatically when the mediaQuery changes
  $: isClosed = mediaQuery ? false : true
  // the pre or other overflowed element
  // So I decide to give them another option
  // to open another page and display a alert message
  onMount(() => {
    // Not use listeners anymore
    // Only detect if tab is close by initial state
    mediaQuery = window.matchMedia("(min-width: 640px)").matches
    addStyle(codeContainer, "pre", "border-2 border-base-200 shadow-sm shadow-base-content rounded-md mr-2 bg-base-300 blockcode")
    // console.log("Plugin", Prism.plugins.lineNumbers)
    // get the language of the code
    try {
      code
        .getElementsByTagName("code")
        .item(0)
        .classList.forEach((className) => {
          if (className.startsWith("language-")) {
            language = className
          }
          code.classList.add("line-numbers")
        })
    } catch (err) {
      console.log(err)
    }
  })

  const handleViewCode = ()=>{
    codeStore.set({
      content: code.outerHTML,
      fromId: postId,
    })
    window.open('/code', '_blank');
  }

</script>

<!-- I know I should have use slot -->
<div class="mx-4">
  <div class="button-group flex font-sans mx-1">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
      on:click|preventDefault={() => (isClosed = !isClosed)}
      class={styles.button}
      role="button"
      href="#">{isClosed ? "Show" : "Hide"} Code</a
    >
    <!-- TODO: implement a function to open another page to show the code -->
    <!-- it can be modal window or a standalone window -->
    {#if !isClosed}
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        on:click|preventDefault={handleViewCode}
        class={styles.button}
        role="button"
        target=”_blank”
        href="/code">
          View Source
        </a
      >
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        on:click|preventDefault={() => {
          copyTextToClipboard(copyInfo)
        }}
        class={styles.button}
        role="button"
        href="#"
        >{isCopied ? "Copied" : "Copy"}
      </a>
    {/if}
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
      on:click|preventDefault={doNothing}
      class="{styles.button + ' font-mono lowercase'} "
      role="button"
      href="#">{language}</a
    >
  </div>
  <div
    class="transition-all {isClosed
      ? 'invisible w-0 opacity-0'
      : 'visible opacity-100'}"
    bind:this={codeContainer}
  >
    {@html code.outerHTML}
  </div>
</div>

<style lang="postcss">
  @import "../styles/pre";
  @import "../styles/prism-github";
</style>
