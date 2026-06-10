export default {
  name: "contacts",
  label: "Contacts",
  path: "content/contacts",
  format: "mdx",
  ui: { allowedActions: { create: true, delete: true } },
  fields: [
    { name: "role", label: "Role", type: "string", required: true },
    { name: "name", label: "Name", type: "string" },
    {
      name: "contact_methods",
      label: "Contact Methods",
      type: "object",
      list: true,
      fields: [
        { name: "type", label: "Type (email/phone/etc.)", type: "string" },
        { name: "value", label: "Value (example@email.com / 123-456-7890 / etc.", type: "string"}
      ]
    },
    { name: "order", label: "Order", type: "number" },
    { name: "description", label: "Description", type: "rich-text", isBody: true }
  ]
}