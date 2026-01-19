import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createBlogPost, getBlogPostBySlug } from "@/lib/db/posts";
import { blogPostSchema } from "@/lib/validations/blog";
import type { PostStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    // Check if slug already exists
    const existingPost = await getBlogPostBySlug(validatedData.slug);
    if (existingPost) {
      return NextResponse.json(
        { message: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await createBlogPost({
      title: validatedData.title,
      slug: validatedData.slug,
      status: validatedData.status as PostStatus,
      tag: validatedData.tag,
      publishedAt: new Date(validatedData.publishedAt),
      summary: validatedData.summary,
      content: validatedData.content,
      coverImage: validatedData.coverImage || null,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create post" },
      { status: 500 }
    );
  }
}
