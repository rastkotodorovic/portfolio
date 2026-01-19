import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/db/posts";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const initialData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    status: project.status as "published" | "draft",
    summary: project.summary,
    publishedAt: project.publishedAt.toISOString().split("T")[0],
    teamSize: project.teamSize,
    link: project.link || "",
    content: project.content || "",
    coverImage: project.coverImage || "",
    images: project.images || [],
  };

  return (
    <div className="max-w-4xl">
      <ProjectForm initialData={initialData} isEditing />
    </div>
  );
}
