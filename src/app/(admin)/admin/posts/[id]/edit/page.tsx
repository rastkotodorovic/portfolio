import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { getBlogPostById } from "@/lib/db/posts";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    notFound();
  }

  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status as "published" | "draft",
    tag: post.tag,
    publishedAt: post.publishedAt.toISOString().split("T")[0],
    summary: post.summary,
    content: post.content || "",
  };

  return (
    <div className="max-w-4xl">
      <BlogPostForm initialData={initialData} isEditing />
    </div>
  );
}
