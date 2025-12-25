import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { FileText, FolderKanban, Users, Eye } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const stats = [
    {
      title: "Blog Posts",
      value: "12",
      description: "Total published posts",
      icon: FileText,
    },
    {
      title: "Projects",
      value: "8",
      description: "Portfolio projects",
      icon: FolderKanban,
    },
    {
      title: "Users",
      value: "3",
      description: "Admin users",
      icon: Users,
    },
    {
      title: "Page Views",
      value: "2.4k",
      description: "Last 30 days",
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Your latest blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Getting Started with Next.js", date: "2 days ago" },
                { title: "Building with Once UI", date: "5 days ago" },
                { title: "Design System Patterns", date: "1 week ago" },
              ].map((post) => (
                <div
                  key={post.title}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <span className="text-sm font-medium">{post.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {post.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your portfolio projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Portfolio Builder", status: "Published" },
                { title: "Design System", status: "Published" },
                { title: "Figma Pipeline", status: "Draft" },
              ].map((project) => (
                <div
                  key={project.title}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <span className="text-sm font-medium">{project.title}</span>
                  <span
                    className={`text-xs ${
                      project.status === "Published"
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
