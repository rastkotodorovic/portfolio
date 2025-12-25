import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/admin/data-table";
import { columns, BlogPost } from "./columns";
import { Button } from "@/components/admin/ui/button";
import { Plus } from "lucide-react";

const dummyPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-nextjs-15",
    status: "published",
    tag: "Tutorial",
    publishedAt: "2025-01-15",
    summary: "Learn how to build modern web applications with Next.js 15",
  },
  {
    id: "2",
    title: "Building with Once UI Design System",
    slug: "building-once-ui",
    status: "published",
    tag: "Design",
    publishedAt: "2025-01-10",
    summary: "Explore the Once UI design system and its components",
  },
  {
    id: "3",
    title: "Advanced TypeScript Patterns",
    slug: "advanced-typescript-patterns",
    status: "draft",
    tag: "Development",
    publishedAt: "2025-01-08",
    summary: "Deep dive into advanced TypeScript patterns for better code",
  },
  {
    id: "4",
    title: "Optimizing React Performance",
    slug: "optimizing-react-performance",
    status: "published",
    tag: "Performance",
    publishedAt: "2025-01-05",
    summary: "Tips and tricks for optimizing your React applications",
  },
  {
    id: "5",
    title: "Introduction to MDX",
    slug: "introduction-mdx",
    status: "published",
    tag: "Tutorial",
    publishedAt: "2024-12-28",
    summary: "Learn how to use MDX for rich content authoring",
  },
  {
    id: "6",
    title: "Deploying to Vercel",
    slug: "deploying-vercel",
    status: "published",
    tag: "DevOps",
    publishedAt: "2024-12-20",
    summary: "Step-by-step guide to deploying your Next.js app on Vercel",
  },
  {
    id: "7",
    title: "State Management in 2025",
    slug: "state-management-2025",
    status: "draft",
    tag: "Development",
    publishedAt: "2024-12-15",
    summary: "Comparing modern state management solutions for React",
  },
  {
    id: "8",
    title: "Tailwind CSS Best Practices",
    slug: "tailwind-best-practices",
    status: "published",
    tag: "Design",
    publishedAt: "2024-12-10",
    summary: "Best practices for using Tailwind CSS in your projects",
  },
  {
    id: "9",
    title: "Testing React Components",
    slug: "testing-react-components",
    status: "published",
    tag: "Testing",
    publishedAt: "2024-12-05",
    summary: "A comprehensive guide to testing React components",
  },
  {
    id: "10",
    title: "API Design Patterns",
    slug: "api-design-patterns",
    status: "draft",
    tag: "Backend",
    publishedAt: "2024-12-01",
    summary: "Best practices for designing RESTful APIs",
  },
  {
    id: "11",
    title: "Authentication with NextAuth.js",
    slug: "authentication-nextauth",
    status: "published",
    tag: "Security",
    publishedAt: "2024-11-25",
    summary: "Implementing authentication using NextAuth.js",
  },
  {
    id: "12",
    title: "Database Design Fundamentals",
    slug: "database-design-fundamentals",
    status: "published",
    tag: "Backend",
    publishedAt: "2024-11-20",
    summary: "Learn the fundamentals of database design",
  },
];

export default async function PostsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={dummyPosts}
        searchKey="title"
        searchPlaceholder="Filter posts..."
      />
    </div>
  );
}
