import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectsTable } from "./projects-table";
import { Button } from "@/components/admin/ui/button";
import { Plus } from "lucide-react";
import { getAllProjects } from "@/lib/db/posts";
import { mapPrismaProjectToUI } from "@/lib/db/mappers";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const prismaProjects = await getAllProjects();
  const projects = prismaProjects.map(mapPrismaProjectToUI);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <ProjectsTable initialData={projects} />
    </div>
  );
}
