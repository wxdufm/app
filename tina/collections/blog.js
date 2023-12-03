import { wrapFieldsWithMeta } from "tinacms";

export default {
  label: "Blog Posts",
  name: "blog",
  path: "content/blog",
  format: "md",
  ui: {
    filename: {
      // if disabled, the editor can not edit the filename
      readonly: true,
      // Example of using a custom slugify function
      slugify: (values) => {
        // Values is an object containing all the values of the form. In this case it is {title?: string, topic?: string}
        return `${values?.title
          ?.toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")}`;
      },
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      placeholder: "post title",
    },
    {
      type: "string",
      label: "Author",
      name: "author",
      placeholder: "post author",
    },
    {
      name: "cover",
      type: "image",
      label: "Cover Image",
    },
    {
      type: "object",
      list: true,
      name: "categories",
      label: "Categories",

      fields: [
        {
          type: "reference",
          label: "Category",
          name: "category",
          collections: ["category"],
        },
      ],
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
      placeholder: "post description",
    },
    {
      type: "rich-text",
      label: "Blog Post Body",
      name: "body",
      placeholder: "post body",
      isBody: true,
      templates: [
        {
          name: "AudioFileGD",
          label: "Audio File: Google Drive Embed",
          fields: [
            {
              name: "url",
              label: "URL",
              type: "string",
            },
          ],
        },
        // {
        //   name: "AudioFileMP3",
        //   label: "Audio File: Hosted MP3",
        //   fields: [
        //     {
        //       name: "url",
        //       label: "URL",
        //       type: "string",
        //     },
        //   ],
        // },
      ],
      // ui: {
      //   component: "textarea",
      // },
    },
  ],
  // ui: {
  //   router: ({ document }) => {
  //     return `/blog/${document._sys.filename}`;
  //   },
  // },
};
