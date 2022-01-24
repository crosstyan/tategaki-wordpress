<script lang="ts">
  import Article from "../components/Article.svelte"
  import { onMount } from "svelte"
  import { of, Observable } from "rxjs"
  import { switchMap, catchError } from "rxjs/operators"
  import { fromFetch } from "rxjs/fetch"
  import { config, getPostApiUrl } from "../../config"
  import type { Post } from "../utils/post"
  import { Jumper } from "svelte-loading-spinners"
  import { colors } from "../styles/sharedStyle"
  import { Link } from 'svelte-routing'
  import ErrorPrompt from "../components/ErrorPrompt.svelte"

  export let id: string
  let isLoading = true
  let isError = false
  let articleTitle = "Unknown"
  let errorMsg = ""
  let post: Post
  const api = new URL(getPostApiUrl(config))

  function fetchPostOnce(api: URL, id: string): Observable<Post | null> {
    api.href = api.href + `/${id}`
    api.search = new URLSearchParams({
      _fields: "id,title,content,date,date_gmt,_links,link",
      _embed: "1",
    }).toString()
    // console.log(api)
    const data = fromFetch(api.toString()).pipe(
      switchMap((res) => {
        // I know I should check it
        if (res.ok) {
          return res.json() as Promise<Post>
        } else {
          try {
            res.json().then((data) => {
              errorMsg = data.message
            })
          } catch (e) {
            errorMsg = e.message
            throw new Error(e.message as string)
          }
          of(null)
        }
      }),
      catchError((err: Error) => {
        errorMsg = err.message
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
        if (result) {
          post = result
          articleTitle = post.title.rendered
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

<svelte:head>
  <title>{`${config.blogName} - ${articleTitle}`}</title>
</svelte:head>
{#if isLoading}
  <div class="flex bg-transparent px-4 py-3 justify-center">
    <Jumper color={colors.loading} />
  </div>
{:else if isError}
  <!-- TODO: Error interface -->
  <ErrorPrompt code={404} msg={errorMsg} />
{:else}
  <Article
    id={post.id}
    title={post.title.rendered}
    content={post.content.rendered}
    author={post._embedded.author[0].name}
    date={new Date(post.date)}
    isSingle={true}
  />

  <!-- svelte-ignore a11y-invalid-attribute -->
  <Link to="/">
    <div
      class="flex bg-transparent text-base-content px-4 mr-2 py-3 h-auto w-auto hover:text-accent font-sans transition-colors"
      role="button"
      href="#"
    >
      Back to Home
    </div>
  </Link>
{/if}

<!-- markup (zero or more items) goes here -->
<style>
</style>
