<script lang="ts">
  import MultiplePosts from "./lib/pages/MultiplePosts.svelte"
  import PostPage from "./lib/pages/PostPage.svelte"
  import ErrorPrompt from "./lib/components/ErrorPrompt.svelte"
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
  <nav
    class="navbar my-2 md:my-8 md:px-8 md:mt-8 shadow-lg bg-neutral text-neutral-content rounded-box mr-4 font-sans"
  >
    <Link to="/">
      <div class="flex-1 py-2 my-2 ">
        <span class="text-lg md:text-4xl font-bold font-serif hover:text-neutral-focus opacity-90 transition-all duration-500">
          Crosstyan のブログ</span
        >
      </div>
    </Link>
  </nav>
  <main>
    <div class="flex flex-col" id="container">
      <Route path="/">
        <MultiplePosts />
      </Route>
      <Route path="/page/:page" let:params>
        <MultiplePosts page={parseInt(params.page)} />
      </Route>
      <Route path="/post/:id" let:params>
        <PostPage id={params.id} />
      </Route>
      <Route>
        <div id="article-frame" class="font-serif pr-8 mr-8">
          <ErrorPrompt code={400} msg="无效路由" />
        </div>
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
