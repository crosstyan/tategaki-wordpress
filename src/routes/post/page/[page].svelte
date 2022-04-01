<script lang="ts">
  import Article from "@/lib/components/Article.svelte"
  import type { Post } from "@/lib/utils/post"
  import { config, getPostApiUrl } from "@/config"
  import { page } from "$app/stores"
  import type { FetchFunction } from "@/lib/utils"
  import { Jumper } from "svelte-loading-spinners"
  import { colors } from "@/lib/styles/sharedStyle"

  // NOTE: about theme color
  // https://github.com/saadeghi/daisyui/blob/master/src/colors/themes.js

  export let postList: Post[] = []
  // https://svelte.dev/tutorial/readable-stores
  let initPaginaion = $page.params.page
  let pagination = initPaginaion
  let isLoading = false


  let getNextPageUrl = (page: number):string => `/post/page/${page}`
  async function fetchNextPage(page:number) {
    const api = new URL(getPostApiUrl(config))
    api.search = new URLSearchParams({
      page: page.toString(),
      _fields: "id,title,content,date,date_gmt,_links,link",
      _embed: "1",
    }).toString()
    const resp = await fetch(api.toString())
    if (resp.ok){
      const postList: Post[] = await resp.json()
      return postList
    }
    return []
  }

  // will mutate postList and pagination and isLoading
  function handleNextPage() {
    isLoading = true
    const page = parseInt(pagination) + 1
    const newPosts = fetchNextPage(page)
    newPosts.then(posts => {
      postList = postList.concat(posts)
      isLoading = false
      if (posts.length > 0) {
        try {
          const nextPageUrl = getNextPageUrl(page)
          window.history.replaceState('', '', nextPageUrl)
        } catch (err) {
          console.error(err)
        }
      }
    })
    pagination = page.toString()
  }

</script>
<script context="module" lang="ts">
  export async function load( { params, fetch }: 
  { params:{ page: string },
    fetch:  FetchFunction} ) {
    const page = params.page
    const api = new URL(getPostApiUrl(config))
    api.search = new URLSearchParams({
      page: page.toString(),
      _fields: "id,title,content,date,date_gmt,_links,link",
      _embed: "1",
    }).toString()
    const resp = await fetch(api.toString())
    if (resp.ok){
      const postList: Post[] = await resp.json()
      return {
        props:{
          postList: postList
        }
      }
    }
    // https://kit.svelte.dev/docs/loading#output-status
    const errorMsg = (await resp.json()).message
    return {
      error: errorMsg,
      status: resp.status
    }
  }
</script>

<svelte:head>
	<title>{config.blogName}</title>
</svelte:head>
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
    <Jumper color="{colors.loading}" />
  </div>
{:else}
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a
    on:click|preventDefault={handleNextPage}
    class="flex bg-transparent text-base-content px-4 mr-2 py-3 h-auto w-auto hover:text-accent font-sans transition-colors"
    role="button"
    href="#">Next page</a
  >
{/if}

<style lang="scss">
</style>
