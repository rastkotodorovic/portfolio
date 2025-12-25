import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { Button } from "@/components/admin/ui/button";
import { Plus } from "lucide-react";
import { getAllBlogPosts } from "@/lib/db/posts";
import { mapPrismaBlogPostToUI } from "@/lib/db/mappers";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  const prismaPosts = await getAllBlogPosts();
  const posts = prismaPosts.map(mapPrismaBlogPostToUI);

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
        data={posts}
        searchKey="title"
        searchPlaceholder="Filter posts..."
      />
    </div>
  );
}
