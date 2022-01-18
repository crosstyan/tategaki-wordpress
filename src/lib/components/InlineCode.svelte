<script lang="ts">
  export let codeElem: HTMLElement
  // TODO: inlineCode hover to display horizontal code
  // https://www.npmjs.com/package/svelte-tooltip
  // Tooltip
</script>

<!-- markup (zero or more items) goes here -->
<span
  class="code text-gray-300 text-sm font-mono my-1 py-2 bg-slate-600 no-underline"
  >{@html codeElem.outerHTML}</span
>

<style lang="postcss">
  /* your styles go here */
</style>
