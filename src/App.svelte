<script lang="ts">
  // import Heti from "./lib/heti/js/heti-addon"
  import Article from "./lib/components/Article.svelte"
  // import { PostList } from "./lib/utils/dummy"
  import type { Post } from "./lib/utils/post"
  import { onMount } from "svelte"
  import { of } from "rxjs"
  import { fromFetch } from "rxjs/fetch"
  import { switchMap, catchError } from "rxjs/operators"
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
  let postList:Post[] = []
  // TODO: implement pagination
  let page = 2
  // let PostList = []
  onMount(async () => {
    // 'https://jsonplaceholder.typicode.com/posts'
    const api = new URL("https://blog.moe.wtf/wp-json/wp/v2/posts")
    api.search = new URLSearchParams({
        page: page.toString(),
    }).toString ()
    const data$ = fromFetch(api.toString()).pipe(
      switchMap((res) => {
        return res.json()
      }),
      catchError((err) => of([]))
    )
    data$.subscribe({
      next: (result) => postList = result,
      complete: () => console.log("done"),
    })
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
      {#each postList as post}
        <Article title={post.title.rendered} content={post.content.rendered} />
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
    overflow-y: hidden;
    writing-mode: vertical-rl;
  }
  main {
    height: 98vh;
    vertical-align: middle;
  }
  #container {
    // writing-mode: vertical-rl;
    height: 95vh;
  }
  .to-fullwidth {
    text-orientation: upright;
  }
</style>
