import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be less than 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase, alphanumeric, and can contain hyphens"
    ),
  status: z.enum(["published", "draft"], {
    message: "Status is required",
  }),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(500, "Summary must be less than 500 characters"),
  publishedAt: z.string().min(1, "Published date is required"),
  teamSize: z
    .number()
    .min(1, "Team size must be at least 1")
    .max(100, "Team size must be less than 100"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  content: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
