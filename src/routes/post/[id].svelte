<script lang="ts">
  // https://svelte.dev/tutorial/module-exports
  // https://stackoverflow.com/questions/65930303/sveltekit-how-do-i-do-slug-based-dynamic-routing
  import Article from "@/lib/components/Article.svelte"
  import type { Post } from "@/lib/utils/post"
  import { onMount } from "svelte"
  import { config, getPostApiUrl } from "@/config"
  import type { FetchFunction } from "@/lib/utils"
  // NOTE: about theme color
  // https://kit.svelte.dev/docs/loading
  // https://github.com/saadeghi/daisyui/blob/master/src/colors/themes.js

  export let post: Post

  onMount(async () => {
    // nothing
  })
</script>

<script context="module" lang="ts">
  export async function load( { params, fetch }: 
  { params: { id: string }, 
    fetch:  FetchFunction} ) {
    const api = new URL(getPostApiUrl(config))
    api.href = api.href + `/${params.id}`
    api.search = new URLSearchParams({
      _fields: "id,title,content,date,date_gmt,_links,link",
      _embed: "1",
    }).toString()
    const resp = await fetch(api.toString())
    if (resp.ok){
      const post: Post = await resp.json()
      return {
        props:{
          post: post
        }
      }
    }
    const errorMsg = (await resp.json()).message
    return {
      error: errorMsg,
      status: resp.status
    }
  }
</script>

<svelte:head>
  <title>{`${config.blogName} - ${post.title.rendered}`}</title>
</svelte:head>
  <Article
    id={post.id}
    title={post.title.rendered}
    content={post.content.rendered}
    author={post._embedded.author[0].name}
    date={new Date(post.date)}
    isSingle={true}
  />

  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="/">
    <div
      class="flex bg-transparent text-base-content px-4 mr-2 py-3 h-auto w-auto hover:text-accent font-sans transition-colors"
      role="button"
      href="#"
    >
      Back to Home
    </div>
  </a>

<style lang="scss">
</style>