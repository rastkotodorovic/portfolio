"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/admin/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { blogPostSchema, type BlogPostFormData } from "@/lib/validations/blog";
import { ImageUpload } from "@/components/admin/image-upload";

interface BlogPostFormProps {
  initialData?: BlogPostFormData & { id?: string };
  isEditing?: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogPostForm({ initialData, isEditing = false }: BlogPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      status: "draft",
      tag: "",
      publishedAt: new Date().toISOString().split("T")[0],
      summary: "",
      content: "",
      coverImage: "",
    },
  });

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/admin/posts/${initialData?.id}`
        : "/api/admin/posts";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save post");
      }

      toast.success(isEditing ? "Post updated successfully" : "Post created successfully");
      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);

    // Auto-generate slug only if slug is empty or matches previous auto-generated slug
    const currentSlug = form.getValues("slug");
    const previousTitle = form.getValues("title");
    if (!currentSlug || currentSlug === generateSlug(previousTitle)) {
      form.setValue("slug", generateSlug(title));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Post" : "Create New Post"}</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your blog post details below."
                : "Fill in the details for your new blog post."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Awesome Blog Post"
                      {...field}
                      onChange={handleTitleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    The title of your blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-awesome-blog-post" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version of the title. Auto-generated from title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      folder="blog"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Featured image for the blog post.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Post visibility status.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="Technology" {...field} />
                    </FormControl>
                    <FormDescription>
                      Category tag for the post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publish Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When to publish the post.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of your blog post..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description that appears in post listings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (MDX)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your blog post content here using MDX format..."
                      className="min-h-[300px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content of your post. Supports MDX (Markdown with JSX).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Post"
                : "Create Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/posts")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
