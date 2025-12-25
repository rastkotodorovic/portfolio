import { PrismaClient, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Blog Posts
  const blogPosts = [
    {
      title: "Getting Started with Next.js 15",
      slug: "getting-started-nextjs-15",
      status: PostStatus.published,
      tag: "Tutorial",
      publishedAt: new Date("2025-01-15"),
      summary: "Learn how to build modern web applications with Next.js 15",
    },
    {
      title: "Building with Once UI Design System",
      slug: "building-once-ui",
      status: PostStatus.published,
      tag: "Design",
      publishedAt: new Date("2025-01-10"),
      summary: "Explore the Once UI design system and its components",
    },
    {
      title: "Advanced TypeScript Patterns",
      slug: "advanced-typescript-patterns",
      status: PostStatus.draft,
      tag: "Development",
      publishedAt: new Date("2025-01-08"),
      summary: "Deep dive into advanced TypeScript patterns for better code",
    },
    {
      title: "Optimizing React Performance",
      slug: "optimizing-react-performance",
      status: PostStatus.published,
      tag: "Performance",
      publishedAt: new Date("2025-01-05"),
      summary: "Tips and tricks for optimizing your React applications",
    },
    {
      title: "Introduction to MDX",
      slug: "introduction-mdx",
      status: PostStatus.published,
      tag: "Tutorial",
      publishedAt: new Date("2024-12-28"),
      summary: "Learn how to use MDX for rich content authoring",
    },
    {
      title: "Deploying to Vercel",
      slug: "deploying-vercel",
      status: PostStatus.published,
      tag: "DevOps",
      publishedAt: new Date("2024-12-20"),
      summary: "Step-by-step guide to deploying your Next.js app on Vercel",
    },
    {
      title: "State Management in 2025",
      slug: "state-management-2025",
      status: PostStatus.draft,
      tag: "Development",
      publishedAt: new Date("2024-12-15"),
      summary: "Comparing modern state management solutions for React",
    },
    {
      title: "Tailwind CSS Best Practices",
      slug: "tailwind-best-practices",
      status: PostStatus.published,
      tag: "Design",
      publishedAt: new Date("2024-12-10"),
      summary: "Best practices for using Tailwind CSS in your projects",
    },
    {
      title: "Testing React Components",
      slug: "testing-react-components",
      status: PostStatus.published,
      tag: "Testing",
      publishedAt: new Date("2024-12-05"),
      summary: "A comprehensive guide to testing React components",
    },
    {
      title: "API Design Patterns",
      slug: "api-design-patterns",
      status: PostStatus.draft,
      tag: "Backend",
      publishedAt: new Date("2024-12-01"),
      summary: "Best practices for designing RESTful APIs",
    },
    {
      title: "Authentication with NextAuth.js",
      slug: "authentication-nextauth",
      status: PostStatus.published,
      tag: "Security",
      publishedAt: new Date("2024-11-25"),
      summary: "Implementing authentication using NextAuth.js",
    },
    {
      title: "Database Design Fundamentals",
      slug: "database-design-fundamentals",
      status: PostStatus.published,
      tag: "Backend",
      publishedAt: new Date("2024-11-20"),
      summary: "Learn the fundamentals of database design",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`Seeded ${blogPosts.length} blog posts`);

  // Seed Projects
  const projects = [
    {
      title: "Automating Design Handovers with Figma Pipeline",
      slug: "automate-design-handovers-with-a-figma-to-code-pipeline",
      status: PostStatus.published,
      summary:
        "A pipeline that converts Figma designs directly into clean, production-ready code",
      publishedAt: new Date("2024-04-01"),
      teamSize: 3,
      link: "https://once-ui.com/",
    },
    {
      title: "Building Once UI Design System",
      slug: "building-once-ui-a-customizable-design-system",
      status: PostStatus.published,
      summary: "A customizable design system for modern web applications",
      publishedAt: new Date("2024-03-15"),
      teamSize: 2,
      link: "https://once-ui.com/",
    },
    {
      title: "Simple Portfolio Builder",
      slug: "simple-portfolio-builder",
      status: PostStatus.published,
      summary: "A simple and elegant portfolio builder for creatives",
      publishedAt: new Date("2024-02-20"),
      teamSize: 1,
    },
    {
      title: "E-commerce Platform Redesign",
      slug: "ecommerce-platform-redesign",
      status: PostStatus.draft,
      summary: "Complete redesign of an e-commerce platform focusing on UX",
      publishedAt: new Date("2024-01-10"),
      teamSize: 5,
      link: "https://example.com/",
    },
    {
      title: "Mobile App for Health Tracking",
      slug: "mobile-health-tracking-app",
      status: PostStatus.published,
      summary:
        "Cross-platform mobile app for personal health and fitness tracking",
      publishedAt: new Date("2023-12-05"),
      teamSize: 4,
      link: "https://example.com/health",
    },
    {
      title: "AI-Powered Content Generator",
      slug: "ai-content-generator",
      status: PostStatus.draft,
      summary:
        "An AI tool for generating marketing content and social media posts",
      publishedAt: new Date("2023-11-20"),
      teamSize: 2,
    },
    {
      title: "Real-time Collaboration Tool",
      slug: "realtime-collaboration-tool",
      status: PostStatus.published,
      summary: "A real-time collaboration platform for remote teams",
      publishedAt: new Date("2023-10-15"),
      teamSize: 6,
      link: "https://example.com/collab",
    },
    {
      title: "Dashboard Analytics Platform",
      slug: "dashboard-analytics-platform",
      status: PostStatus.published,
      summary: "Business intelligence dashboard with advanced analytics",
      publishedAt: new Date("2023-09-01"),
      teamSize: 3,
      link: "https://example.com/analytics",
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log(`Seeded ${projects.length} projects`);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
