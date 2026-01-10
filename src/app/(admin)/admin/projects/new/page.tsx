import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProjectForm } from "@/components/admin/project-form";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-4xl">
      <ProjectForm />
    </div>
  );
}
