/** @format */
import { defineConfig, loadEnv } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import react from '@vitejs/plugin-react';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import dynamicImport from 'vite-plugin-dynamic-import';
import timeReporter from 'vite-plugin-time-reporter';
import pkg from './package.json' assert { type: 'json' };

export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

	return defineConfig({
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version),
			global: {}
		},
		server: {
			port: parseInt(process.env.VITE_APP_PORT || '') || 8001,
			// host: '192.168.68.214',
			https: true,
			open: true,
			proxy: {
				'/proxy-api': {
					target: process.env.VITE_APP_APIBASE,
					changeOrigin: true,
					rewrite: path => path.replace(/^\/proxy-api/, ''),
				},
			},
		},
		resolve: {
			alias: [
				{
					find: /\@\//,
					replacement: path.join(__dirname, './src/'),
				},
			]
		},
		plugins: [
			timeReporter(), 
			dynamicImport(), 
			react(), 
			mkcert()
		],
		optimizeDeps: {
			esbuildOptions: {
				// Node.js global to browser globalThis
				define: {
						global: 'globalThis'
				},
				// Enable esbuild polyfill plugins
				plugins: [
					NodeGlobalsPolyfillPlugin({
						buffer: true
					})
				]
			}
		}
	});
};
