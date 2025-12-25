import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/admin/data-table";
import { columns, Project } from "./columns";
import { Button } from "@/components/admin/ui/button";
import { Plus } from "lucide-react";

const dummyProjects: Project[] = [
  {
    id: "1",
    title: "Automating Design Handovers with Figma Pipeline",
    slug: "automate-design-handovers-with-a-figma-to-code-pipeline",
    status: "published",
    summary: "A pipeline that converts Figma designs directly into clean, production-ready code",
    publishedAt: "2024-04-01",
    teamSize: 3,
    link: "https://once-ui.com/",
  },
  {
    id: "2",
    title: "Building Once UI Design System",
    slug: "building-once-ui-a-customizable-design-system",
    status: "published",
    summary: "A customizable design system for modern web applications",
    publishedAt: "2024-03-15",
    teamSize: 2,
    link: "https://once-ui.com/",
  },
  {
    id: "3",
    title: "Simple Portfolio Builder",
    slug: "simple-portfolio-builder",
    status: "published",
    summary: "A simple and elegant portfolio builder for creatives",
    publishedAt: "2024-02-20",
    teamSize: 1,
  },
  {
    id: "4",
    title: "E-commerce Platform Redesign",
    slug: "ecommerce-platform-redesign",
    status: "draft",
    summary: "Complete redesign of an e-commerce platform focusing on UX",
    publishedAt: "2024-01-10",
    teamSize: 5,
    link: "https://example.com/",
  },
  {
    id: "5",
    title: "Mobile App for Health Tracking",
    slug: "mobile-health-tracking-app",
    status: "published",
    summary: "Cross-platform mobile app for personal health and fitness tracking",
    publishedAt: "2023-12-05",
    teamSize: 4,
    link: "https://example.com/health",
  },
  {
    id: "6",
    title: "AI-Powered Content Generator",
    slug: "ai-content-generator",
    status: "draft",
    summary: "An AI tool for generating marketing content and social media posts",
    publishedAt: "2023-11-20",
    teamSize: 2,
  },
  {
    id: "7",
    title: "Real-time Collaboration Tool",
    slug: "realtime-collaboration-tool",
    status: "published",
    summary: "A real-time collaboration platform for remote teams",
    publishedAt: "2023-10-15",
    teamSize: 6,
    link: "https://example.com/collab",
  },
  {
    id: "8",
    title: "Dashboard Analytics Platform",
    slug: "dashboard-analytics-platform",
    status: "published",
    summary: "Business intelligence dashboard with advanced analytics",
    publishedAt: "2023-09-01",
    teamSize: 3,
    link: "https://example.com/analytics",
  },
];

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={dummyProjects}
        searchKey="title"
        searchPlaceholder="Filter projects..."
      />
    </div>
  );
}
