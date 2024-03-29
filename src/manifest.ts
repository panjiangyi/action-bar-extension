import { defineManifest } from '@crxjs/vite-plugin';

import packageData from '../package.json';

export default defineManifest({
	name: packageData.name,
	description: packageData.description,
	version: packageData.version,
	manifest_version: 3,
	icons: {
		16: 'img/logo-16.png',
		32: 'img/logo-34.png',
		48: 'img/logo-48.png',
		128: 'img/logo-128.png',
	},
	commands: {
		'open-arc': {
			suggested_key: {
				default: 'Ctrl+Shift+K',
				mac: 'Command+Shift+K',
			},
			description: 'Open command menu',
		},
	},
	action: {
		default_popup: 'popup.html',
		default_icon: 'img/logo-48.png',
	},
	options_page: 'options.html',
	background: {
		service_worker: 'src/background/index.ts',
		type: 'module',
	},
	content_scripts: [
		{
			matches: ['http://*/*', 'https://*/*'],
			js: ['src/contentScript/index.tsx'],
		},
	],

	web_accessible_resources: [
		{
			resources: [
				'img/logo-16.png',
				'img/logo-34.png',
				'img/logo-48.png',
				'img/logo-128.png',
			],
			matches: [],
		},
	],
	permissions: [
		'tabs',
		'activeTab',
		'bookmarks',
		'browsingData',
		'scripting',
		'search',
		'history',
		'storage',
		'favicon',
	],
	// chrome_url_overrides: {
	//   newtab: 'newtab.html',
	// },
});
