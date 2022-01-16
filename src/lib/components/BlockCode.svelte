<script lang="ts">
  import { onMount } from "svelte"
  import Prism from "prismjs"
  // Expect the element to be
  // <pre>
  //   <code class="language-javascript">
  //     var foo = 'bar'; // Code here
  //   </code>
  // </pre>
  export let code: HTMLElement
  let isClosed = false
  // TODO I can't fix the bug that IOS user can't scroll
  // the pre or other overflowed element
  // So I decide to give them another option
  // to open another page and display a alert message
  onMount(() => {
    try {
      Prism.highlightElement(code.getElementsByTagName("code")[0])
    } catch (e) {
      console.error(e)
    }
  })
</script>

<!-- I know I should have use slot -->
<div class=" mx-2 mt-2">
  <div class="button-group flex">
    <a
      on:click|preventDefault={function () {
        isClosed = !isClosed
      }}
      class="flex mt-3 px-1 py-3 bg-blue-200 rounded-full"
      role="button"
      href="#">Hide Code</a
    >
    <a
      class="flex mt-3 px-1 py-3 bg-blue-200 rounded-full"
      role="button"
      href="#">View Source</a
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
  .code-block {
  }
</style>
