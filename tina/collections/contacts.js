// Defining how the Contacts page in Tina behaves and looks.

export default {
  name: "contacts",
  label: "Contacts",
  path: "content/contacts",
  format: "mdx",
  ui: {
  allowedActions: { create: true, delete: true },
  // file name is by default the value of "role". But user can always change it.
  filename: {
    readonly: false,
    slugify: (values) => {
      return `${values?.role || "new-contact"}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    },
  },
},


  fields: [
    { name: "role", label: "Role", type: "string", required: true },
    { name: "name", label: "Name", type: "string" },
    {
      name: "contact_methods",
      label: "Contact Methods",
      type: "object",
      list: true,
      ui: { defaultItem: { type: "Email", value: "", },},
      fields: [
        { name: "type", label: "Type (email/phone/etc.)", type: "string" },
        { name: "value", label: "Value (example@email.com / 123-456-7890 / etc.", type: "string"}
      ]
    },
    { name: "order", label: "Order", type: "number", description: "Lower numbers appear first. Set as 9999 to place this at the end.", 
      // Making the default value 9999 so that it has a low order.
      ui: {
        parse: (value) => {
          if (value === "" || value === null || value === undefined) return 9999
          return Number(value)
        }}
    },
    { name: "description", label: "Description", type: "rich-text", isBody: true }
  ]
}