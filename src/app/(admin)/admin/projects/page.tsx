import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchKey="title"
        searchPlaceholder="Filter projects..."
      />
    </div>
  );
}
