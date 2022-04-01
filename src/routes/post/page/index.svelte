<script lang="ts">
  import type { FetchFunction } from "@/lib/utils"

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
