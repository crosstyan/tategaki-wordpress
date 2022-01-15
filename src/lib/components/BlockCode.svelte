<script lang="ts">
  export let code: HTMLElement;
  // your script goes here
</script>

<style lang="postcss">
  /* your styles go here */
</style>
<!-- I know I should have use slot -->
<div>
  {@html code.outerHTML}
</div>