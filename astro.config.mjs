// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import { rehypeTypo, rehypeBase } from './src/lib/typo.mjs';

// Served from GitHub Pages as a project site: https://noamfav.github.io/Morally/
const base = '/Morally';

// https://astro.build/config
export default defineConfig({
	site: 'https://noamfav.github.io',
	base,
	integrations: [mdx()],
	markdown: { rehypePlugins: [rehypeTypo, rehypeBase({ base })] },
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
