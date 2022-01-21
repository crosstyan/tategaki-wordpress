<script lang="ts">
  import { onMount } from "svelte"
  import { Router, Link, Route } from "svelte-routing"
  import { of, Observable } from "rxjs"
  import { switchMap, catchError } from "rxjs/operators"
  import { fromFetch } from "rxjs/fetch"
  import { config, getPostApiUrl } from "../../config"
  import type { Post } from "../utils/post"
  import { Jellyfish } from "svelte-loading-spinners"
  // {
  // "id": 428,
  // "uuid": "80541a4b-0ef6-4a1a-9398-5e54d4562381",
  // "hitokoto": "旅行的意义在于找到自己，而非浏览他人。",
  // "type": "f",
  // "from": "网络",
  // "from_who": null,
  // "creator": "zerokey",
  // "creator_uid": 0,
  // "reviewer": 0,
  // "commit_from": "web",
  // "created_at": "1468949615",
  // "length": 19
  // }
  interface HitoKoto {
    id: number
    uuid: string
    hitokoto: string
    type: string
    from: string
    from_who: string
    creator: string
    creator_uid: number
    reviewer: number
    commit_from: string
    created_at: number
    length: number
  }

  let isLoading = true
  let isError = false
  let hitokoto: HitoKoto
  const api = new URL("https://v1.hitokoto.cn/")

  function fetchHitokoto(api: URL): Observable<HitoKoto | null> {
    // console.log(api)
    const data = fromFetch(api.toString()).pipe(
      switchMap((res) => {
        // I know I should check it
        if (res.ok) {
          return res.json() as Promise<HitoKoto>
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
    const postObservable = await fetchHitokoto(api)
    postObservable.subscribe({
      next: (result) => {
        if (result) {
          hitokoto = result
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

{#if isLoading}
  <div class="flex bg-transparent px-4 py-3 justify-center">
    <Jellyfish />
  </div>
{:else if isError}
  <p class="text-red-500 font-serif font-bold">
    Error Loading <ruby>一言<rp>(</rp><rt>ひとこと</rt><rp>)</rp></ruby>
  </p>
{:else}
  <div class="flex flex-col">
    <p class="text-xl font-serif pt-24 font-bold">
      {hitokoto.hitokoto}
    </p>
    <p class="text-sm font-serif text-right font-bold">
      <span class="text-gray-700">──{hitokoto.from}</span>
    </p>
  </div>
{/if}

<style lang="postcss">
  /* your styles go here */
</style>
