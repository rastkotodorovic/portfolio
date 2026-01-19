import prisma from "@/lib/prisma";
import type { BlogPost, Project, PostStatus } from "@prisma/client";

// Blog Post functions
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({
    where: { id },
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

export async function createBlogPost(data: {
  title: string;
  slug: string;
  status: PostStatus;
  tag: string;
  publishedAt: Date;
  summary: string;
  content?: string;
  coverImage?: string | null;
}): Promise<BlogPost> {
  return prisma.blogPost.create({
    data,
  });
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    status?: PostStatus;
    tag?: string;
    publishedAt?: Date;
    summary?: string;
    content?: string;
    coverImage?: string | null;
  }
): Promise<BlogPost> {
  return prisma.blogPost.update({
    where: { id },
    data,
  });
}

export async function deleteBlogPost(id: string): Promise<BlogPost> {
  return prisma.blogPost.delete({
    where: { id },
  });
}

// Project functions
export async function getAllProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export async function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({
    where: { id },
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

export async function createProject(data: {
  title: string;
  slug: string;
  status: PostStatus;
  summary: string;
  publishedAt: Date;
  teamSize: number;
  link?: string;
  content?: string;
  coverImage?: string | null;
  images?: string[];
}): Promise<Project> {
  return prisma.project.create({
    data,
  });
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    slug?: string;
    status?: PostStatus;
    summary?: string;
    publishedAt?: Date;
    teamSize?: number;
    link?: string;
    content?: string;
    coverImage?: string | null;
    images?: string[];
  }
): Promise<Project> {
  return prisma.project.update({
    where: { id },
    data,
  });
}

export async function deleteProject(id: string): Promise<Project> {
  return prisma.project.delete({
    where: { id },
  });
}
