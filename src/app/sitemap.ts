import { getPublishedBlogPosts, getPublishedProjects } from "@/lib/db/posts";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://demo.magic-portfolio.com"
).replace(/\/+$/, "");

const isIndexable =
  process.env.SITE_INDEXABLE === "true" || process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

const activeRoutes = ["/", "/about", "/work", "/blog", "/schedule"] as const;

const routePriorities: Record<string, number> = {
  "/": 1,
  "/about": 0.9,
  "/work": 0.8,
  "/blog": 0.8,
  "/schedule": 0.4,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable) {
    return [];
  }

  const routes = activeRoutes.map((route) => ({
    url: `${siteUrl}${route !== "/" ? route : ""}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: routePriorities[route] ?? 0.5,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const blogs = await getPublishedBlogPosts();

    blogRoutes = blogs.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to load blog sitemap entries:", error);
  }

  try {
    const projects = await getPublishedProjects();

    projectRoutes = projects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));
  } catch (error) {
    console.error("Failed to load project sitemap entries:", error);
  }

  return [...routes, ...projectRoutes, ...blogRoutes];
}
