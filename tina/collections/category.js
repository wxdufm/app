export default {
    label: "Category",
    name: "category",
    path: "content/category",
    format: 'md',
    fields: [
      {
        type: "string",
        label: "Title",
        name: "title",
      },
      {
        type: "boolean",
        label: "Specialty Show",
        name: "specialtyShow"
      },
      {
        type: "string",
        label: "Category Description",
        name: "description",
        placeholder: "Optional description"
      }
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