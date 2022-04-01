<script lang="ts">
  import { config, getPostApiUrl } from "@/config"
  import type { FetchFunction } from "@/lib/utils"

  // NOTE: about theme color
  // https://github.com/saadeghi/daisyui/blob/master/src/colors/themes.js

</script>
<script context="module" lang="ts">
  export async function load( { fetch }: 
  { fetch:  FetchFunction} ) {
    return {
      status: 301,
      redirect: "/post/page/1"
    }
  }
</script>

<svelte:head>
	<title>{config.blogName}</title>
</svelte:head>
