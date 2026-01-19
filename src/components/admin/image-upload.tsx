"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  type ImageFolder,
} from "@/lib/s3";

interface ImageUploadProps {
  folder: ImageFolder;
  value?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export function ImageUpload({
  folder,
  value,
  onChange,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get presigned URL from API
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

      const { uploadUrl, publicUrl }: PresignedUrlResponse =
        await presignedResponse.json();

      // Upload directly to S3
      setUploadProgress(10);

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

      setUploadProgress(100);
      onChange(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/admin/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete image");
      }

      onChange(undefined);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete image"
      );
    } finally {
      setIsDeleting(false);
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
    [folder]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  if (value) {
    return (
      <div className={cn("relative group", className)}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
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
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed transition-colors",
        dragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        isUploading && "pointer-events-none opacity-60",
        className
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
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            <p className="text-sm text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-muted">
              {dragActive ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {dragActive ? "Drop to upload" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, WebP, GIF up to {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
