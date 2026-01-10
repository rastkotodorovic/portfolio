import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createProject, getProjectBySlug } from "@/lib/db/posts";
import { projectSchema } from "@/lib/validations/project";
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
    const validatedData = projectSchema.parse(body);

    // Check if slug already exists
    const existingProject = await getProjectBySlug(validatedData.slug);
    if (existingProject) {
      return NextResponse.json(
        { message: "A project with this slug already exists" },
        { status: 400 }
      );
    }

    const project = await createProject({
      title: validatedData.title,
      slug: validatedData.slug,
      status: validatedData.status as PostStatus,
      summary: validatedData.summary,
      publishedAt: new Date(validatedData.publishedAt),
      teamSize: validatedData.teamSize,
      link: validatedData.link || undefined,
      content: validatedData.content,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
