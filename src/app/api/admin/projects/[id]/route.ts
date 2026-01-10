import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
} from "@/lib/db/posts";
import { projectSchema } from "@/lib/validations/project";
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
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Failed to fetch project" },
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
    const validatedData = projectSchema.parse(body);

    // Check if project exists
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Check if slug is being changed and if new slug already exists
    if (validatedData.slug !== existingProject.slug) {
      const projectWithSlug = await getProjectBySlug(validatedData.slug);
      if (projectWithSlug) {
        return NextResponse.json(
          { message: "A project with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const project = await updateProject(id, {
      title: validatedData.title,
      slug: validatedData.slug,
      status: validatedData.status as PostStatus,
      summary: validatedData.summary,
      publishedAt: new Date(validatedData.publishedAt),
      teamSize: validatedData.teamSize,
      link: validatedData.link || undefined,
      content: validatedData.content,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to update project" },
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

    // Check if project exists
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    await deleteProject(id);

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
