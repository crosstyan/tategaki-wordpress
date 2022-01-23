<script lang="ts">
  import MultiplePosts from "./lib/pages/MultiplePosts.svelte"
  import SinglePost from "./lib/pages/SinglePost.svelte"
  import ErrorPrompt from "./lib/components/ErrorPrompt.svelte"
  import CodeView from "./lib/pages/CodeView.svelte"
  import Frame from "./lib/pages/Frame.svelte"
  import { onMount } from "svelte"
  import { Router, Route, navigate } from "svelte-routing"
  import { config } from "./config"
  import { themeChange } from "theme-change"
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
  <Route path="/code">
    <CodeView code="test" />
  </Route>
  <Route path="/*">
    <Nav />
    <Frame>
      <Router>
        <!-- Maybe I should redirect to /page/:page -->
        <Route path="/">
          <MultiplePosts />
        </Route>
        <Route path="page/:page" let:params>
          <MultiplePosts page={parseInt(params.page)} />
        </Route>
        <Route path="post/:id" let:params>
          <SinglePost id={params.id} />
        </Route>
        <Route path=":year/:month/:id" let:params>
          <SinglePost id={params.id} />
        </Route>
        <Route>
          <ErrorPrompt code={400} msg="无效路由" />
        </Route>
      </Router>
    </Frame>
  </Route>
</Router>

<style lang="scss">
</style>
