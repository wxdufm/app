export default {
    label: "Blog Posts",
    name: "post",
    path: "content/post",
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
        type: "datetime",
        label: "Published",
        name: "published",
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
        return `/posts/${document._sys.filename}`;
      },
    },
  };