export default {
  label: "Page Content",
  name: "page",
  path: "content/page",
  format: "mdx",
  fields: [
    {
      name: "body",
      label: "Main Content",
      type: "rich-text",
      isBody: true,
      templates: [
        {
          name: "photoGallery",
          label: "Photo Gallery",
          fields: [
            {
              name: "photos",
              label: "Photos",
              type: "image",
              list: true,
            },
          ],
        },
      ],
    },
  ],
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") {
        return `/`;
      }
      return undefined;
    },
  },
};
