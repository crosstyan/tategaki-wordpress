<script lang="ts">
  import MultiplePosts from "./lib/pages/MultiplePosts.svelte"
  import SinglePost from "./lib/pages/SinglePost.svelte"
  import ErrorPrompt from "./lib/components/ErrorPrompt.svelte"
  import { onMount } from "svelte"
  import { Router, Link, Route } from "svelte-routing"
  import { config } from "./config"
  import { iOS } from "./lib/utils/utils"
  import { themeChange } from 'theme-change'

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
    document.body.addEventListener("wheel", (e) => wheelHandler(e), {
      passive: false,
    })
  })
</script>

<svelte:head>
	<title>{config.blogName}</title>
</svelte:head>
<Router {url}>
  <nav
    class="navbar my-12 mr-8 md:mr-8 md:my-8 md:px-8 shadow-lg bg-primary text-primary-content rounded-box font-sans justify-between"
  >
    <Link to="/">
      <div class="flex-1 py-2 my-2 ">
        <span class="text-lg md:text-4xl font-bold font-serif hover:text-primary-focus opacity-90 transition-all duration-500">
          Crosstyan のブログ</span
        >
      </div>
    </Link>
    <div class="dropdown dropdown-top dropdown-left" style="writing-mode: horizontal-tb;">
      <div class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">      
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>                    
          </svg>
        </button>
      </div>
      <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-secondary text-secondary-content rounded-box w-52">
        <li>
          <a data-toggle-theme="dark,light">Toggle Dark mode</a>
        </li> 
      </ul>
    </div>
  </nav>
  {#if iOS()}
    <div class="my-16 mx-4 md:mr-8 md:my-8">
      <p class="font-serif">致 iOS 用户：由于浏览器的限制，Safari 浏览器无法渲染本网页，若遇到代码或者表格无法滚动或标点渲染不正确，请不要惊慌，这是已知问题。</p>
      <p class="font-serif text-sm">若欲查看源代码请点击 View Source 按钮，但目前未实装。</p>
    </div>
  {/if}
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
