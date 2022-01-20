<script lang="ts">
  import MultiplePosts from "./lib/pages/MultiplePosts.svelte"
  import PostPage from "./lib/pages/PostPage.svelte"
  import { onMount } from "svelte"
  import { Router, Link, Route } from "svelte-routing"

  export let url = ""
  const wheelHandler = (e: WheelEvent) => {
    if (e.deltaX == 0) {
      // console.log(e.target)
      let delta = (e.deltaY || e.detail) >> 10 || 1
      // let delta = ((e.deltaY ) >> 10) || 1;
      delta = delta * 100
      document.documentElement.scrollLeft -= delta
      // safari needs also this
      document.body.scrollLeft -= delta
      e.preventDefault()
    }
  }

  onMount(async () => {
    document.body.addEventListener("wheel", (e) => wheelHandler(e), {
      passive: false,
    })
  })
</script>

<Router {url}>
  <nav>
    <div>This is a simple nav</div>
  </nav>
  <main>
    <div class="flex flex-col" id="container">
      <Route path="/">
        <MultiplePosts/>
      </Route>
      <Route path="/post/:id" let:params>
        <PostPage id={params.id}/>
      </Route>
    </div>
  </main>
</Router>

<style global lang="scss">
  #article-frame {
    max-height: 70vh;
  }
  // use "user-scalable" in "viewport" meta
  // to solve user can scale the page
  // A bug/feature in Webkit based browsers
  html {
    max-height: 100vh;
  }
  body {
    // set vertical-rl to make the initial scroll position
    // the most left
    max-height: 100vh;
    overflow-y: hidden;
    writing-mode: vertical-rl;
  }
  main {
    padding: 4rem;
    height: 98vh;
    vertical-align: middle;
  }
  @media screen and (max-width: 640px) {
    main {
      padding: 0.5em;
      height: 98vh;
    }
    #article-frame {
      max-height: 96vh;
    }
  }
  #container {
    // writing-mode: vertical-rl;
    height: 95vh;
  }
  .to-fullwidth {
    text-orientation: upright;
  }
</style>
