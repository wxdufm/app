export default {
	label: 'Archive',
	name: 'archive',
	path: 'content/archive',
	format: 'md',
	ui: {
		filename: {
			// if disabled, the editor can not edit the filename
			readonly: true,
			// Example of using a custom slugify function
			slugify: (values) => {
				// Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
				//
				return `${values?.title
					?.toLowerCase()
					.replace(/[^\w\s]/gi, '')
					.replace(/\s+/g, '-')}`
			},
		},
	},
	fields: [
		{
			type: 'string',
			label: 'Title',
			name: 'title',
		},
		{
			name: 'cover',
			type: 'image',
			label: 'Cover Image',
		},
		{
			type: 'object',
			list: true,
			name: 'categories',
			label: 'Categories',

			fields: [
				{
					type: 'reference',
					label: 'Category',
					name: 'category',
					collections: ['category'],
				},
			],
		},
		{
			type: 'datetime',
			label: 'Published',
			name: 'published',
		},
		{
			type: 'rich-text',
			label: 'Post Description',
			name: 'description',
			isBody: true,
		},
	],
}
