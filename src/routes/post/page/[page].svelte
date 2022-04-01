<script lang="ts">
  import Article from "@/lib/components/Article.svelte"
  import type { Post } from "@/lib/utils/post"
  import { config, getPostApiUrl } from "@/config"
  import type { FetchFunction } from "@/lib/utils"

  // NOTE: about theme color
  // https://github.com/saadeghi/daisyui/blob/master/src/colors/themes.js

  export let postList: Post[] = []
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

<style lang="scss">
</style>
