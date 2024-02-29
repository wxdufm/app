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
				let formattedDate = '';
				if (values.published) {
					const date = new Date(values.published); 
					const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
					formattedDate = date.toLocaleDateString('en-US', options).replace(/\//g, '-');
				}

				return `${values?.title
					?.toLowerCase()
					.replace(/[^\w\s]/gi, '')
					.replace(/\s+/g, '-')}` + '-' + formattedDate
			},
		},
	},
	fields: [
		{
			type: 'string',
			label: 'Title',
			name: 'title',
			placeholder: 'subject of specialty show or show title'
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
