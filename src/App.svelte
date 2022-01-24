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

  onMount(async () => {
    themeChange(false)
  })
</script>

<svelte:head>
  <title>{config.blogName}</title>
</svelte:head>
<Router {url}>
  <Route path="/code">
    <CodeView />
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
