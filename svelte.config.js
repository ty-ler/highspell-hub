// import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-static';
import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

const prod = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// adapter: adapter(),
		adapter: adapter(),
		// adapter: adapter({
		// 	// default options are shown
		// 	pages: 'build',
		// 	assets: 'build',
		// 	fallback: null,
		// 	precompress: false
		// }),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		paths: {
			base: prod ? '/.' : '',
			assets: prod ? '/.' : ''
		}
	}
};

export default config;
