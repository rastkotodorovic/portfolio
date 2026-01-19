"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Upload, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  type ImageFolder,
} from "@/lib/s3";

interface MultiImageUploadProps {
  folder: ImageFolder;
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export function MultiImageUpload({
  folder,
  value = [],
  onChange,
  maxImages = 10,
  className,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIndexes, setDeletingIndexes] = useState<number[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      return "Invalid file type. Please upload JPEG, PNG, WebP, or GIF.";
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);

      return;
    }

    if (value.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);

      return;
    }

    setIsUploading(true);

    try {
      const presignedResponse = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder,
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!presignedResponse.ok) {
        const error = await presignedResponse.json();

        throw new Error(error.message || "Failed to get upload URL");
      }

      const { uploadUrl, publicUrl }: PresignedUrlResponse = await presignedResponse.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      onChange([...value, publicUrl]);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const url = value[index];
    if (!url) return;

    setDeletingIndexes((prev) => [...prev, index]);

    try {
      const response = await fetch("/api/admin/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();

        throw new Error(error.message || "Failed to delete image");
      }

      const newValue = value.filter((_, i) => i !== index);
      onChange(newValue);
      toast.success("Image removed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete image"
      );
    } finally {
      setDeletingIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        uploadFile(e.dataTransfer.files[0]);
      }
    },
    [folder, value, maxImages]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Existing images */}
        {value.map((url, index) => (
          <div key={url} className="relative group aspect-video">
            <div className="relative w-full h-full overflow-hidden rounded-lg border bg-muted">
              <Image
                src={url}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  disabled={deletingIndexes.includes(index)}
                >
                  {deletingIndexes.includes(index) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new image slot */}
        {canAddMore && (
          <div
            className={cn(
              "relative aspect-video flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              isUploading && "pointer-events-none opacity-60"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={ALLOWED_IMAGE_TYPES.join(",")}
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />

            <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                  <p className="text-xs text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-full bg-muted">
                    {dragActive ? (
                      <Upload className="h-5 w-5 text-primary" />
                    ) : (
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dragActive ? "Drop image" : "Add image"}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        {value.length} of {maxImages} images. JPEG, PNG, WebP, GIF up to {MAX_FILE_SIZE_MB}MB each.
      </p>
    </div>
  );
}
