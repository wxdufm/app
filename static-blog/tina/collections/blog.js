export default {
    label: "Blog Posts",
    name: "blog",
    path: "content/blog",
    format: 'md',
    fields: [
      {
        type: "string",
        label: "Title",
        name: "title",
      },
      {
        type: "string",
        label: "Author",
        name: "author",
      },
      {
        type: "string",
        label: "Cover",
        name: "cover",
      },
      {
        name: 'hero',
        type: 'image',
        label: 'Hero Image',
      },
      {
        type: 'string',
        label: 'Tags',
        name: 'tags',
        list: true,
      },
      {
        type: "datetime",
        label: "Published",
        name: "published",
      },
      {
        type: "string",
        label: "Post Description",
        name: "description",
      },
      {
        type: "string",
        label: "Blog Post Body",
        name: "body",
        isBody: true,
        ui: {
          component: "textarea",
        },
      },
    ],
    ui: {
      router: ({ document }) => {
        return `/blog/${document._sys.filename}`;
      },
    },
  };