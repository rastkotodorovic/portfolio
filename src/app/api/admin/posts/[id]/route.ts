import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getBlogPostById,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/db/posts";
import { blogPostSchema } from "@/lib/validations/blog";
import type { PostStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await getBlogPostById(id);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    // Check if post exists
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check if slug is being changed and if new slug already exists
    if (validatedData.slug !== existingPost.slug) {
      const postWithSlug = await getBlogPostBySlug(validatedData.slug);
      if (postWithSlug) {
        return NextResponse.json(
          { message: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const post = await updateBlogPost(id, {
      title: validatedData.title,
      slug: validatedData.slug,
      status: validatedData.status as PostStatus,
      tag: validatedData.tag,
      publishedAt: new Date(validatedData.publishedAt),
      summary: validatedData.summary,
      content: validatedData.content,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if post exists
    const existingPost = await getBlogPostById(id);
    if (!existingPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await deleteBlogPost(id);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Failed to delete post" },
      { status: 500 }
    );
  }
}
