import {defineConfig, defineSchema} from 'tinacms'

import collectionPage from './collections/page.js'
import collectionBlog from './collections/blog.js'
import collectionArchive from './collections/archive.js'
import collectionCategory from './collections/category.js'

const schema = defineSchema({
	collections: [
		collectionPage,
		collectionBlog,
		collectionArchive,
		collectionCategory,
	],
})

export const config = defineConfig({
	clientId: process.env.TINA_PUBLIC_CLIENT_ID,
	branch: 'main',
	token: process.env.TINA_TOKEN,
	media: {
		tina: {
			publicFolder: 'public',
			mediaRoot: 'uploads',
		},
	},
	search: {
		tina: {
			indexerToken: process.env.SEARCH_TOKEN,
			stopwordLanguages: ['eng'],
		},
		indexBatchSize: 100,
		maxSearchIndexFieldLength: 100,
	},
	build: {
		publicFolder: 'public', // The public asset folder for your framework
		outputFolder: 'admin', // within the public folder
	},
	schema,
})

export default config
