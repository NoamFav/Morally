// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import { rehypeTypo } from './src/lib/typo.mjs';

// https://astro.build/config
export default defineConfig({
	integrations: [mdx()],
	markdown: { rehypePlugins: [rehypeTypo] },
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'EB Garamond',
			cssVariable: '--font-text',
			weights: [400, 500, 600],
			styles: ['normal', 'italic'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['Garamond', 'Georgia', 'serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Cormorant Garamond',
			cssVariable: '--font-display',
			weights: [500, 600],
			styles: ['normal', 'italic'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['Garamond', 'Georgia', 'serif'],
		},
	],
});
