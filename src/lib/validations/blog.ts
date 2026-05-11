import { z } from "zod";

const imageUrlSchema = z
  .string()
  .refine(
    (value) => value.startsWith("/api/images/") || z.string().url().safeParse(value).success,
    "Must be a valid URL",
  );

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be less than 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, alphanumeric, and can contain hyphens",
    ),
  status: z.enum(["published", "draft"], {
    message: "Status is required",
  }),
  tag: z.string().min(1, "Tag is required").max(50, "Tag must be less than 50 characters"),
  publishedAt: z.string().min(1, "Published date is required"),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(500, "Summary must be less than 500 characters"),
  content: z.string().optional(),
  coverImage: imageUrlSchema.optional().or(z.literal("")),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
