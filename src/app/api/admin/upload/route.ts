import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  createPresignedUrlResponse,
  isAllowedImageType,
  MAX_FILE_SIZE_BYTES,
  type ImageFolder,
} from "@/lib/s3";

const ALLOWED_FOLDERS: ImageFolder[] = ["blog", "projects"];

interface UploadRequest {
  folder: ImageFolder;
  filename: string;
  contentType: string;
  fileSize?: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: UploadRequest = await request.json();
    const { folder, filename, contentType, fileSize } = body;

    // Validate folder
    if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { message: "Invalid folder. Must be 'blog' or 'projects'" },
        { status: 400 }
      );
    }

    // Validate filename
    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { message: "Filename is required" },
        { status: 400 }
      );
    }

    // Validate content type
    if (!contentType || !isAllowedImageType(contentType)) {
      return NextResponse.json(
        {
          message:
            "Invalid content type. Allowed: image/jpeg, image/png, image/webp, image/gif",
        },
        { status: 400 }
      );
    }

    // Validate file size if provided
    if (fileSize && fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "File size exceeds maximum allowed (10 MB)" },
        { status: 400 }
      );
    }

    const response = await createPresignedUrlResponse(
      folder,
      filename,
      contentType
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating presigned URL:", error);

    return NextResponse.json(
      { message: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
