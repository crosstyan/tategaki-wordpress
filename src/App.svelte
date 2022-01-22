<script lang="ts">
  import MultiplePosts from "./lib/pages/MultiplePosts.svelte"
  import SinglePost from "./lib/pages/SinglePost.svelte"
  import ErrorPrompt from "./lib/components/ErrorPrompt.svelte"
  import { onMount } from "svelte"
  import { Router, Route } from "svelte-routing"
  import { config } from "./config"
  import { themeChange } from 'theme-change'
  import Nav from "./lib/components/Nav.svelte"
  // NOTE: about theme color
  // https://github.com/saadeghi/daisyui/blob/master/src/colors/themes.js
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
    themeChange(false)
    // https://stackoverflow.com/questions/40469948/safari-ios-input-doesnt-lose-focus-on-click-outside-blur-dont-trigger
    // @ts-ignore
    // mainFrame.tabIndex = -1
    // navFrame.tabIndex = -1
    document.body.addEventListener("wheel", (e) => wheelHandler(e), {
      passive: false,
    })
  })
</script>

<svelte:head>
	<title>{config.blogName}</title>
</svelte:head>
<Router {url}>
  <Nav />
  <main>
    <div class="flex flex-col" id="container">
      <Route path="/">
        <MultiplePosts />
      </Route>
      <Route path="/page/:page" let:params>
        <MultiplePosts page={parseInt(params.page)} />
      </Route>
      <Route path="/post/:id" let:params>
        <SinglePost id={params.id} />
      </Route>
      <Route path="/:year/:month/:id" let:params>
        <SinglePost id={params.id} />
      </Route>
      <Route>
        <div id="article-frame" class="font-serif flex flex-col divide-x-2 divide-x-reverse ">
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
  table {
    writing-mode: horizontal-tb;
    display: inline-block;
    overflow: auto;
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
  .to-fullwidth {
    text-orientation: upright;
  }
</style>
