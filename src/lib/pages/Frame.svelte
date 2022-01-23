<script lang="ts">
</script>

<svelte:head>
  <style>
    body {
      /* set vertical-rl to make the initial scroll position
      the most right */
      max-height: 100vh;
      overflow-y: hidden;
      writing-mode: vertical-rl;
    }
    table {
      writing-mode: horizontal-tb;
      display: inline-block;
      overflow: auto;
      max-height: 70vh;
    }
  </style>
</svelte:head>

<style lang="scss">
  // use "user-scalable" in "viewport" meta
  // to solve user can scale the page
  // A bug/feature in Webkit based browsers

  // https://natclark.com/tutorials/svelte-global-styles/
  main {
    padding: 4rem;
    height: 98vh;
    vertical-align: middle;
  }


  #article-frame {
    max-height: 70vh;
  }

  @media screen and (max-width: 640px) {
    main {
      padding: 0.5em;
      height: 98vh;
    }
    #article-frame {
      padding-top: 4em;
      max-height: 76vh;
    }
  }

  #container {
    // writing-mode: vertical-rl;
    height: 95vh;
  }
</style>

<!-- markup (zero or more items) goes here -->

<main>
  <div class="flex flex-col" id="container">
    <div
      id="article-frame"
      class="font-serif flex flex-col divide-x-2 divide-x-reverse "
    >
      <slot></slot>
    </div>
  </div>
</main>
