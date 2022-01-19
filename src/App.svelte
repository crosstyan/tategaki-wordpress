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
      delta = delta * 100
      document.documentElement.scrollLeft -= delta
      // safari needs also this
      document.body.scrollLeft -= delta
      e.preventDefault()
    }
  }
  let postList: Post[] = []
  // TODO: use a standalone config file
  const api = new URL("https://blog.moe.wtf/wp-json/wp/v2/posts")
  // TODO: implement pagination
  let page = 1
  // let PostList = []
  function fetchPosts(api, page) {
    // 'https://jsonplaceholder.typicode.com/posts'
    api.search = new URLSearchParams({
      page: page.toString(),
    }).toString()
    const data = fromFetch(api.toString()).pipe(
      switchMap((res) => {
        // I know I should check it
        return res.json() as Promise<Post[]>
      }),
      catchError((err) => {
        console.error(err)
        return of([] as Post[])
      })
    )
    return data
  }

  function handleNextPage() {
    page++
    fetchPosts(api, page).subscribe({
      next: (data) => (postList = postList.concat(data)),
      complete: () => console.log(`done ${page}`),
    })
  }

  onMount(async () => {
    const posts = await fetchPosts(api, page)
    posts.subscribe({
      next: (result) => (postList = postList.concat(result)),
      complete: () => console.log("done"),
    })
    document.body.addEventListener("wheel", (e) => wheelHandler(e), {
      passive: false,
    })
  })
</script>

<main>
  <div class="flex flex-col" id="container">
    <div id="article-frame" class="flex flex-col divide-x-2 divide-x-reverse ">
      {#each postList as post}
        <Article title={post.title.rendered} content={post.content.rendered} />
      {/each}

      <a
        on:click|preventDefault={handleNextPage}
        class="flex bg-transparent text-gray-900 mt-3 px-1 py-3 h-auto w-auto justify-center hover:text-blue-600 font-sans transition-colors"
        role="button"
        href="#">Next Page</a
      >
    </div>
  </div>
</main>

<style global lang="scss">
  #article-frame {
    max-height: 70vh;
  }
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
