import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteObject, extractKeyFromUrl } from "@/lib/s3";

interface DeleteRequest {
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: DeleteRequest = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { message: "URL is required" },
        { status: 400 }
      );
    }

    const key = extractKeyFromUrl(url);

    if (!key) {
      return NextResponse.json(
        { message: "Invalid URL or unable to extract key" },
        { status: 400 }
      );
    }

    // Verify the key belongs to an allowed folder
    const allowedPrefixes = ["blog/", "projects/"];
    const isAllowedPath = allowedPrefixes.some((prefix) =>
      key.startsWith(prefix)
    );

    if (!isAllowedPath) {
      return NextResponse.json(
        { message: "Cannot delete files outside of allowed folders" },
        { status: 403 }
      );
    }

    await deleteObject(key);

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);

    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    );
  }
}
