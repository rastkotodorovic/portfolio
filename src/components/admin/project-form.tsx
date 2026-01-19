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
import { projectSchema, type ProjectFormData } from "@/lib/validations/project";
import { ImageUpload } from "@/components/admin/image-upload";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";

interface ProjectFormProps {
  initialData?: ProjectFormData & { id?: string };
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

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      status: "draft",
      summary: "",
      publishedAt: new Date().toISOString().split("T")[0],
      teamSize: 1,
      link: "",
      content: "",
      coverImage: "",
      images: [],
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/admin/projects/${initialData?.id}`
        : "/api/admin/projects";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();

        throw new Error(error.message || "Failed to save project");
      }

      toast.success(isEditing ? "Project updated successfully" : "Project created successfully");
      router.push("/admin/projects");
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
            <CardTitle>{isEditing ? "Edit Project" : "Create New Project"}</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your project details below."
                : "Fill in the details for your new project."}
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
                      placeholder="My Awesome Project"
                      {...field}
                      onChange={handleTitleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    The title of your project.
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
                    <Input placeholder="my-awesome-project" {...field} />
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
                      folder="projects"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Featured image for the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gallery Images</FormLabel>
                  <FormControl>
                    <MultiImageUpload
                      folder="projects"
                      value={field.value || []}
                      onChange={field.onChange}
                      maxImages={10}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional images displayed in project carousel.
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
                      Project visibility status.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of team members.
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
                      When to publish the project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    External link to the project (e.g., live demo, GitHub).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of your project..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description that appears in project listings.
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
                      placeholder="Write your project content here using MDX format..."
                      className="min-h-[300px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content of your project. Supports MDX (Markdown with JSX).
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
                ? "Update Project"
                : "Create Project"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projects")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
