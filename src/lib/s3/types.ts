export type ImageFolder = "blog" | "projects";
export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function isAllowedImageType(contentType: string): contentType is AllowedImageType {
  return ALLOWED_IMAGE_TYPES.includes(contentType as AllowedImageType);
}
