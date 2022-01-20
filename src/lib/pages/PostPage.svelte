<script lang="ts">
  import Article from "../components/Article.svelte"
  import { onMount } from "svelte"
  import { Router, Link, Route } from "svelte-routing"
  import { of, Observable } from "rxjs"
  import { switchMap, catchError } from "rxjs/operators"
  import { fromFetch } from "rxjs/fetch"
  import {config, getPostApiUrl} from "../../config"
  import type {Post} from "../utils/post"
  import { Jumper } from "svelte-loading-spinners"
  
  export let id
  let isLoading = true
  let isError = false
  let post:Post;
  const api = new URL(getPostApiUrl(config))

  function fetchPostOnce(api: URL, id:number): Observable<Post|null> {
    api.href = api.href + `/${id}`
    api.search = new URLSearchParams({
      _fields: "id,title,content,date,date_gmt,_links,link",
      _embed: "1",
    }).toString()
    // console.log(api)
    const data = fromFetch(api.toString()).pipe(
      switchMap((res) => {
        // I know I should check it
        if (res.ok){
          return res.json() as Promise<Post>
        } else {
          return of(null)
        }
      }),
      catchError((err) => {
        console.error(err)
        return of(null)
      })
    )
    return data
  }

  onMount(async () => {
    isLoading = true
    const postObservable = await fetchPostOnce(api, id)
    postObservable.subscribe({
      next: (result) => {
        if (result){
          post = result
          isError = false
        } else {
          isError = true
        }
      },
      complete: () => {
        isLoading = false
        console.log("done")
      },
    })
  })
</script>

<style>
</style>

<div id="article-frame" class="flex flex-col divide-x-2 divide-x-reverse ">

  {#if isLoading}
    <div class="flex bg-transparent px-4 py-3 justify-center">
      <Jumper color="#2564eb" />
    </div>
  {:else if isError}
    <p class="text-red-500">Error</p>
  {:else}
    <Article
      id={post.id}
      title={post.title.rendered}
      content={post.content.rendered}
      author={post._embedded.author[0].name}
      date={new Date(post.date)}
      isSingle={true}
    />
  {/if}
</div>

<!-- markup (zero or more items) goes here -->