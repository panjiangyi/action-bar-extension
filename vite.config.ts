import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

import manifest from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		emptyOutDir: true,
		outDir: 'build',
		sourcemap: 'inline',
		rollupOptions: {
			output: {
				chunkFileNames: 'assets/chunk-[hash].js',
			},
		},
	},

	plugins: [
		crx({ manifest }),
		react({ plugins: [['@swc-jotai/react-refresh', {}]] }),
	],
});
