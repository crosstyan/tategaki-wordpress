<script lang="ts">
  import Article from "../components/Article.svelte"
  import type { Post } from "../utils/post"
  import { onMount } from "svelte"
  import { of, Observable } from "rxjs"
  import { fromFetch } from "rxjs/fetch"
  import { Jumper } from "svelte-loading-spinners"
  import { switchMap, catchError } from "rxjs/operators"
  import { Router, Link, Route } from "svelte-routing"
  import { config, getPostApiUrl } from "../../config"
  let isLoading = true
  let postList: Post[] = []
  // TODO: use a standalone config file
  const api = new URL(getPostApiUrl(config))
  // TODO: implement route
  // TODO: implement single article page
  // https://stackoverflow.com/questions/58287729/how-can-i-export-a-function-from-a-svelte-component-that-changes-a-value-in-the
  export let page = 1

  function fetchPosts(api: URL, page: number) {
    // https://jsonplaceholder.typicode.com/posts
    // https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/
    api.search = new URLSearchParams({
      page: page.toString(),
      _fields: "id,title,content,date,date_gmt,_links,link",
      _embed: "1",
    }).toString()
    // console.log(api)
    const data = fromFetch(api.toString()).pipe(
      switchMap((res) => {
        // I know I should check it
        if (res.ok) {
          return res.json() as Promise<Post[]>
        } else {
          return of(null)
        }
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
    isLoading = true
    fetchPosts(api, page).subscribe({
      next: (data) => (postList = postList.concat(data)),
      complete: () => {
        isLoading = false
        console.log("done")
      },
    })
  }

  onMount(async () => {
    isLoading = true
    const posts = await fetchPosts(api, page)
    posts.subscribe({
      next: (result) => {
        // console.log(result)
        postList = postList.concat(result)
      },
      complete: () => {
        isLoading = false
        console.log("done")
      },
    })
  })
</script>

<div id="article-frame" class="flex flex-col divide-x-2 divide-x-reverse ">
  {#each postList as post}
    <Article
      id={post.id}
      title={post.title.rendered}
      content={post.content.rendered}
      author={post._embedded.author[0].name}
      date={new Date(post.date)}
    />
  {/each}

  {#if isLoading}
    <div class="flex bg-transparent px-4 py-3 justify-center">
      <Jumper color="#2564eb" />
    </div>
  {:else}
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
      on:click|preventDefault={handleNextPage}
      class="flex bg-transparent text-gray-900 px-1 py-3 h-auto w-auto justify-center hover:text-blue-600 font-sans transition-colors"
      role="button"
      href="#">Next page</a
    >
  {/if}
</div>

<style lang="postcss">
</style>
