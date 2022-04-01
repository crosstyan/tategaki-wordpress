<script context="module" lang="ts">
	export async function load({ fetch }: { fetch: FetchFunction }) {
		const page = 1
		const api = new URL(getPostApiUrl(config))
		api.search = new URLSearchParams({
			_fields: 'id,title,date,date_gmt',
			per_page: (100).toString(),
			page: page.toString()
		}).toString()
		const resp = await fetch(api.toString())
		const result: Post[] = await resp.json()

    if (resp.ok) {
      let yearPosts: YearPosts[] = []
      yearPosts = yearPosts.concat(convertToYearPosts(result.map(convertToDateTitle)))
      return {
        props: {
          yearPosts: yearPosts
        }
      }
    }
    // TODO: refactor this to avoid duplication
    const errorMsg = (await resp.json()).message
    return {
      error: errorMsg,
      status: resp.status
    }
	}
</script>

<script lang="ts">
	import ErrorPrompt from '@/lib/components/ErrorPrompt.svelte'
	import { of, Observable } from 'rxjs'
	import { switchMap, catchError } from 'rxjs/operators'
	import { fromFetch } from 'rxjs/fetch'
	import { config, getPostApiUrl } from '@/lib/../config'
	import type { Post } from '@/lib/utils/post'
	import { Jumper } from 'svelte-loading-spinners'
	import { colors } from '@/lib/styles/sharedStyle'
	import type { FetchFunction } from '@/lib/utils'
	import {
		type YearPosts,
		concatYearPosts,
		convertToYearPosts,
		convertToDateTitle
	} from '@/lib/utils/datetitle'

	let errorMsg = ''
	let page = 1
	let isLoading = false
	let isError = false
	export let yearPosts: YearPosts[] = []
	const api = new URL(getPostApiUrl(config))

	// Post only has "id,title,date,date_gmt" properties
	function fetchPostTitles(api: URL, page: number): Observable<Post[] | null> {
		api.search = new URLSearchParams({
			_fields: 'id,title,date,date_gmt',
			per_page: (100).toString(),
			page: page.toString()
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

	function handleNextPage() {
		page++
		isLoading = true
		fetchPostTitles(api, page).subscribe({
			next: (result) => {
				if (result) {
					yearPosts = concatYearPosts(
						yearPosts,
						convertToYearPosts(result.map(convertToDateTitle))
					)
					isError = false
				} else {
					isError = true
				}
			},
			complete: () => {
				isLoading = false
			}
		})
	}
</script>

<svelte:head>
	<title>{`${config.blogName}`}</title>
</svelte:head>

<div class="divide-x-0">
	{#each yearPosts as yearPost}
		<div class="flex flex-col ml-2">
			{#each yearPost.posts as post}
				<header class="inline-flex items-center mb-4">
					<h2 class="text-sm font-light mb-1 flex">
						<span class="tcy mb-1">{post.month}</span>
						<span>月</span>
						<span class="tcy mb-1">{post.day}</span>
						<span>日</span>
					</h2>
					<a href={`/post/${post.id}`}>
						<h1
							lang="jp"
							class="text-base font-bold hover:text-accent transition-colors duration-200"
						>
							{@html post.title}
						</h1>
					</a>
				</header>
			{/each}
			<h1 class="text-2xl sm:text-4xl ml-4 font-sans">{yearPost.year}</h1>
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
	.tcy {
		-webkit-text-combine: horizontal;
		-ms-text-combine-horizontal: all;
		text-combine-upright: all;
		position: static !important;
	}
</style>
