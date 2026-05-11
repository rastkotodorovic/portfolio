import { getS3Client, getS3Config } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ key: string[] }>;
}

const ALLOWED_PREFIXES = ["blog/", "projects/"];

export async function GET(_request: Request, { params }: RouteParams) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  if (!ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }

  const config = getS3Config();

  if (!config.bucket) {
    return NextResponse.json({ message: "S3 bucket not configured" }, { status: 500 });
  }

  try {
    const object = await getS3Client().send(
      new GetObjectCommand({
        Bucket: config.bucket,
        Key: key,
      }),
    );

    if (!object.Body) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    const bytes = Buffer.from(await object.Body.transformToByteArray());
    const contentType = object.ContentType || "application/octet-stream";

    return new NextResponse(bytes, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);

    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }
}
