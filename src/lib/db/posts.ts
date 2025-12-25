import prisma from "@/lib/prisma";
import type { BlogPost, Project } from "@prisma/client";

// Blog Post functions
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
}

// Project functions
export async function getAllProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return prisma.project.findUnique({
    where: { slug },
  });
}

export async function getPublishedProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
}
