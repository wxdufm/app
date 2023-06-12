export default {
    label: "Archive",
    name: "archive",
    path: "content/archive",
    format: 'md',
    fields: [
      {
        type: "string",
        label: "Title",
        name: "title",
      },
      {
        type: "string",
        label: "Cover",
        name: "cover",
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
        isBody: true,
        ui: {
          component: "textarea",
        },
      },
    ],
    ui: {
      router: ({ document }) => {
        return `/archive/${document._sys.filename}`;
      },
    },
  };