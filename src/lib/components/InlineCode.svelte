<script lang="ts">
  import Tooltip from "./Tooltip.svelte"
  export let codeElem: HTMLElement
  // https://www.npmjs.com/package/svelte-tooltip
  // https://svelte.dev/repl/dd6754a2ad0547c5b1c1ea37c0293fef?version=3.46.2
  // Tooltip
  // TODO: maybe it's better to use `use:tooltip` instead of component
</script>

<Tooltip title={codeElem.innerText}>
  <span
    class="code text-gray-200 text-sm font-mono my-1 py-2 bg-gray-600 no-underline"
    >{@html codeElem.outerHTML}</span
  >
</Tooltip>

<style lang="postcss">
  /* your styles go here */
</style>
