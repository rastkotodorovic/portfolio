import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client, getS3Config } from "./client";
import type { ImageFolder, PresignedUrlResponse } from "./types";
import { isAllowedImageType } from "./types";

/**
 * Generate a unique object key for S3 storage
 */
export function generateObjectKey(folder: ImageFolder, filename: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

  return `${folder}/${timestamp}-${randomSuffix}-${sanitizedFilename}`;
}

/**
 * Generate a presigned URL for uploading an image to S3
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  if (!isAllowedImageType(contentType)) {
    throw new Error(`Invalid content type: ${contentType}`);
  }

  const client = getS3Client();
  const config = getS3Config();

  if (!config.bucket) {
    throw new Error("S3 bucket not configured");
  }

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: 600, // 10 minutes
  });

  const publicUrl = getPublicUrl(key);

  return { uploadUrl, publicUrl };
}

/**
 * Get the public URL for an object in S3
 */
export function getPublicUrl(key: string): string {
  const config = getS3Config();

  // Use custom public URL if provided (e.g., CDN)
  if (config.publicUrl) {
    if (config.publicUrl.startsWith("/")) {
      return `${config.publicUrl.replace(/\/$/, "")}/${key}`;
    }

    return `${config.publicUrl.replace(/\/$/, "")}/${key}`;
  }

  // Construct URL based on endpoint and bucket
  if (config.endpoint) {
    const endpointUrl = new URL(config.endpoint);
    // For path-style access used by many S3-compatible providers.
    if (process.env.S3_FORCE_PATH_STYLE === "true") {
      return `${config.endpoint}/${config.bucket}/${key}`;
    }
    // For virtual-hosted style
    return `${endpointUrl.protocol}//${config.bucket}.${endpointUrl.host}/${key}`;
  }

  // Default AWS S3 URL format
  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}

/**
 * Delete an object from S3
 */
export async function deleteObject(key: string): Promise<void> {
  const client = getS3Client();
  const config = getS3Config();

  if (!config.bucket) {
    throw new Error("S3 bucket not configured");
  }

  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  await client.send(command);
}

/**
 * Extract the object key from a public URL
 */
export function extractKeyFromUrl(url: string): string | null {
  const config = getS3Config();

  try {
    const urlObj = new URL(url, "http://app.local");
    const pathname = decodeURIComponent(urlObj.pathname);

    const imageProxyPrefix = "/api/images/";
    if (pathname.startsWith(imageProxyPrefix)) {
      return pathname.slice(imageProxyPrefix.length);
    }

    // Check if it's a custom public URL
    if (config.publicUrl) {
      const publicUrlObj = new URL(config.publicUrl, "http://app.local");
      const publicPath = publicUrlObj.pathname.replace(/\/$/, "");

      if (urlObj.origin === publicUrlObj.origin) {
        if (publicPath && pathname.startsWith(`${publicPath}/`)) {
          return pathname.slice(publicPath.length + 1);
        }

        if (!publicPath || publicPath === "/") {
          return pathname.slice(1);
        }
      }
    }

    // Check for path-style URL
    if (config.endpoint && process.env.S3_FORCE_PATH_STYLE === "true") {
      const bucketPrefix = `/${config.bucket}/`;
      if (pathname.startsWith(bucketPrefix)) {
        return pathname.slice(bucketPrefix.length);
      }
    }

    // Check for virtual-hosted style or default AWS format
    if (urlObj.host.includes(config.bucket)) {
      return pathname.slice(1);
    }

    return null;
  } catch {
    return null;
  }
}

export function normalizeImageUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("/") && !url.startsWith("/api/images/")) {
    return url;
  }

  const key = extractKeyFromUrl(url);

  if (!key) {
    return url;
  }

  return getPublicUrl(key);
}

/**
 * Create presigned URL response for API
 */
export async function createPresignedUrlResponse(
  folder: ImageFolder,
  filename: string,
  contentType: string,
): Promise<PresignedUrlResponse> {
  const key = generateObjectKey(folder, filename);
  const { uploadUrl, publicUrl } = await generatePresignedUploadUrl(key, contentType);

  return {
    uploadUrl,
    key,
    publicUrl,
  };
}
