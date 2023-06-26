export default {
    label: "Photo Gallery",
    name: "gallery",
    path: "content/gallery",
    format: 'mdx',
    fields: [
      {
        type: "string",
        label: "Title",
        name: "title",
      },
      {
        name: 'galleryImage',
        type: 'image',
        label: 'Gallery Image',
        list: true
      },
    ],
    ui: {
      filename: {
        // if disabled, the editor can not edit the filename
        readonly: true,
        // Example of using a custom slugify function
        slugify: values => {
          // Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
          // 
          return `${values?.title?.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}`
        },
      },
    },
  };