// https://kit.svelte.dev/docs/adapters
// import adapter from '@sveltejs/adapter-static'
import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
// https://codingcat.dev/post/make-pathing-easier-with-aliases-in-sveltekit
	kit: {
		vite: {
			resolve:{
				alias: {
					'@': path.resolve('./src'),
				}
			}
		},
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		}
	}
}

export default config
