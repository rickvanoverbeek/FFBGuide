import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      initialValue: "FFB Hub",
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
    }),
    defineField({
      name: "featuredVendors",
      title: "Featured Vendors (Homepage)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "vendor" }] }],
    }),
    defineField({
      name: "featuredGames",
      title: "Featured Games (Homepage)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "game" }] }],
    }),
    defineField({
      name: "featuredArticles",
      title: "Featured Articles (Homepage)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
