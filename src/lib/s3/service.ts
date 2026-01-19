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
  contentType: string
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
    return `${config.publicUrl.replace(/\/$/, "")}/${key}`;
  }

  // Construct URL based on endpoint and bucket
  if (config.endpoint) {
    const endpointUrl = new URL(config.endpoint);
    // For path-style access (MinIO, etc.)
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
    const urlObj = new URL(url);

    // Check if it's a custom public URL
    if (config.publicUrl) {
      const publicUrlObj = new URL(config.publicUrl);
      if (urlObj.host === publicUrlObj.host) {
        return urlObj.pathname.slice(1); // Remove leading slash
      }
    }

    // Check for path-style URL
    if (config.endpoint && process.env.S3_FORCE_PATH_STYLE === "true") {
      const bucketPrefix = `/${config.bucket}/`;
      if (urlObj.pathname.startsWith(bucketPrefix)) {
        return urlObj.pathname.slice(bucketPrefix.length);
      }
    }

    // Check for virtual-hosted style or default AWS format
    if (urlObj.host.includes(config.bucket)) {
      return urlObj.pathname.slice(1); // Remove leading slash
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Create presigned URL response for API
 */
export async function createPresignedUrlResponse(
  folder: ImageFolder,
  filename: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const key = generateObjectKey(folder, filename);
  const { uploadUrl, publicUrl } = await generatePresignedUploadUrl(key, contentType);

  return {
    uploadUrl,
    key,
    publicUrl,
  };
}
