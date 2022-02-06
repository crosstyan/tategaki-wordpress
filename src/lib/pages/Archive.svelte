<script lang="ts">
  import Article from "../components/Article.svelte"
  import ErrorPrompt from "../components/ErrorPrompt.svelte"
  import { onMount } from "svelte"
  import { of, Observable } from "rxjs"
  import { switchMap, catchError } from "rxjs/operators"
  import { fromFetch } from "rxjs/fetch"
  import { config, getPostApiUrl } from "../../config"
  import type { Post } from "../utils/post"
  import { Jumper } from "svelte-loading-spinners"
  import { colors } from "../styles/sharedStyle"
  import { Link } from "svelte-navigator"

  let errorMsg = ""
  let page = 1
  let isLoading = true
  let isError = false
  // let postTitles: Post[]
  // let years: YearPosts[]
  let yearPosts: YearPosts[] = []
  const api = new URL(getPostApiUrl(config))

  interface DateTitle {
    id: number
    title: string
    day: string
    month: string
    year: string
  }

  function convertToDateTitle(post: Post): DateTitle {
    const date = new Date(post.date)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return {
      id: post.id,
      title: post.title.rendered,
      day: day.toString(),
      month: month.toString(),
      year: year.toString(),
    }
  }

  function convertToYearPosts(dateTitles: DateTitle[]): YearPosts[] {
    const years: string[] = []
    const yearPosts: YearPosts[] = []
    dateTitles.forEach((dateTitle) => {
      if (!years.includes(dateTitle.year)) {
        years.push(dateTitle.year)
        yearPosts.push({
          year: dateTitle.year,
          posts: [dateTitle],
        })
      } else {
        yearPosts.forEach((yearPost) => {
          if (yearPost.year === dateTitle.year) {
            yearPost.posts.push(dateTitle)
          }
        })
      }
    })
    return yearPosts
  }

  function concatYearPosts(origPosts: YearPosts[], newPosts: YearPosts[]): YearPosts[] {
    while (newPosts.length > 0) {
      const tempYearPost = newPosts.pop()
      let isConcat = false
      for (const orig of origPosts) {
        if (orig.year === tempYearPost.year) {
          orig.posts = orig.posts.concat(tempYearPost.posts)
          isConcat = true
          break
        }
      }
      if (!isConcat) {
        origPosts.push(tempYearPost)
      }
    }
    return origPosts
  }

  interface YearPosts {
    year: string
    posts: DateTitle[]
  }

  // Post only has "id,title,date,date_gmt" properties
  function fetchPostTitles(api: URL, page: number): Observable<Post[] | null> {
    api.search = new URLSearchParams({
      _fields: "id,title,date,date_gmt",
      per_page: (100).toString(),
      page: page.toString(),
    }).toString()
    // console.log(api)
    const data = fromFetch(api.toString()).pipe(
      switchMap((res) => {
        // I know I should check it
        if (res.ok) {
          return res.json() as Promise<Post[]>
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
    const postObservable = fetchPostTitles(api, page)
    postObservable.subscribe({
      next: (result) => {
        if (result) {
          yearPosts = yearPosts.concat(
            convertToYearPosts(result.map(convertToDateTitle))
          )
          isError = false
        } else {
          isError = true
        }
      },
      complete: () => {
        isLoading = false
      },
    })
  })

  function handleNextPage() {
    page++
    isLoading = true
    fetchPostTitles(api, page).subscribe({
      next: (result) => {
        if (result) {
          yearPosts = concatYearPosts(yearPosts, convertToYearPosts(result.map(convertToDateTitle)))
          isError = false
        } else {
          isError = true
        }
      },
      complete: () => {
        isLoading = false
      },
    })
  }
</script>

<svelte:head>
  <title>{`${config.blogName}`}</title>
</svelte:head>

<div class="divide-x-0">
  {#each yearPosts as yearPost}
    <h1 class="text-2xl sm:text-4xl ml-2 font-sans">{yearPost.year}</h1>
    <div class="flex flex-col ml-4">
      {#each yearPost.posts as post}
        <header class="inline-flex items-center mb-4">
          <h2 class="text-sm font-light mb-1">
            <span class="tcy">{post.month}</span>
            <span>月</span>
            <span class="tcy">{post.day}</span>
            <span>日</span>
          </h2>
          <Link to={`/post/${post.id}`}>
            <h1
              lang="jp"
              class="text-base font-bold hover:text-accent transition-colors duration-200"
            >
              {@html post.title}
            </h1>
          </Link>
        </header>
      {/each}
    </div>
    <!-- <Link to={`/post/${post.id}`}>
      </Link> -->
  {/each}
</div>

{#if isLoading}
  <div class="flex bg-transparent px-4 py-3 justify-center">
    <Jumper color={colors.loading} />
  </div>
{:else if isError}
  <!-- TODO: Error interface -->
  <ErrorPrompt code={404} msg={errorMsg} />
{:else}
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a href="#" on:click|preventDefault={handleNextPage}>
    <div
      class="flex bg-transparent text-base-content px-4 mr-2 py-3 h-auto w-auto hover:text-accent font-sans transition-colors"
      role="button"
      href="#"
    >
      More
    </div>
  </a>
{/if}

<style lang="postcss">
</style>
