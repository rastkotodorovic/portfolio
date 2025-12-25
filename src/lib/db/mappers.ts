import type {
  BlogPost as PrismaBlogPost,
  Project as PrismaProject,
} from "@prisma/client";
import type { BlogPost } from "@/app/(admin)/admin/posts/columns";
import type { Project } from "@/app/(admin)/admin/projects/columns";

/**
 * Maps Prisma BlogPost to Admin UI BlogPost type
 */
export function mapPrismaBlogPostToUI(post: PrismaBlogPost): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    tag: post.tag,
    publishedAt: post.publishedAt.toISOString().split("T")[0],
    summary: post.summary,
  };
}

/**
 * Maps Prisma Project to Admin UI Project type
 */
export function mapPrismaProjectToUI(project: PrismaProject): Project {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    status: project.status,
    summary: project.summary,
    publishedAt: project.publishedAt.toISOString().split("T")[0],
    teamSize: project.teamSize,
    link: project.link ?? undefined,
  };
}
