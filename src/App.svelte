<script lang="ts">
  // import Heti from "./lib/heti/js/heti-addon"
  import Counter from "./lib/components/Counter.svelte"
  import Article from "./lib/components/Article.svelte"
  import { PostList } from "./lib/utils/dummy"
  import { onMount } from "svelte"
  const wheelHandler = (e: WheelEvent) => {
    if (e.deltaX == 0) {
      // console.log(e.target)
      let delta = (e.deltaY || e.detail) >> 10 || 1
      // let delta = ((e.deltaY ) >> 10) || 1;
      delta = delta * 120
      document.documentElement.scrollLeft -= delta
      // safari needs also this
      document.body.scrollLeft -= delta
      e.preventDefault()
    }
  }
  onMount(async () => {
    document.body.addEventListener(
      "wheel",
      (e) => {
        wheelHandler(e)
      },
      { passive: false }
    )
  })
</script>

<main>
  <div class="flex flex-col" id="container">
    <div class="flex flex-col">
      {#each PostList as post}
        <Article title={post.title} content={post.content} />
      {/each}
    </div>
  </div>
</main>

<style global lang="scss">
  // use "user-scalable" in "viewport" meta
  // to solve user can scale the page
  // A bug/feature in Webkit based browsers
  html {
    // position: absolute;
    // top: 0;
    // left: 0;
    max-height: 100vh;
    min-height: 99vh;
    overflow-y: hidden;
  }
  body {
    // set vertical-rl to make the initial scroll position
    // the most left
    writing-mode: vertical-rl;
  }
  pre {
    height: 95vh;
    writing-mode: horizontal-tb;
    flex: auto;
    overflow: auto;
  }
  main {
    height: 98vh;
    vertical-align: middle;
  }
  #container {
    // writing-mode: vertical-rl;
    height: 95vh;
  }
</style>
