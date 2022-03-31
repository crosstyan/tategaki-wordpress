<script lang="ts">
  import HitoKoto from "./HitoKoto.svelte"
  export let code = -1
  export let msg = "Unknown error"
</script>

<div class="ml-16 px-4">
  <h1 class="text-error font-serif font-bold text-3xl ml-2">{code}</h1>
  <p class="font-bold font-serif">{msg}</p>
</div>
<div class="px-16">
  <HitoKoto />
</div>

<style lang="postcss">
</style>
