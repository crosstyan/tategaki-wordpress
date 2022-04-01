<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  let pathname:string
  let paths: string[]
  // $: paths = pathname.split('/')

  function subscribePathname({location, action}) {
    pathname = location.pathname
  }

  /**
   * Unsubscribe a listener function.
   * It won't be called on any future updates
   */
  // type Unlisten = () => void;
  // const unlisten = historyStore.subscribe(subscribePathname)

  // onDestroy(unlisten)

</script>

<div class='breadcrumbs'>
  <!-- {#if paths.length > 2}
    <ul>
      <li>
        <Link to="/"><span class="text-accent hover:text-accent-focus transition-all underline decoration-transparent hover:decoration-accent-focus duration-300">Home</span></Link>
      </li>
      {#each paths as path}
        {#if path !== ''}
          <li>{path}</li>
        {/if}
      {/each}
    </ul>
  {/if} -->
</div>

<style lang="postcss">
  /* Do something with vertical */
  .breadcrumbs>ul>li+:before{
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0.75rem;
    margin-top: 0.5rem;
    --tw-rotate: 135deg;
    opacity: 0.6;
  }
</style>