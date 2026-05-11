import { S3Client } from "@aws-sdk/client-s3";

function createS3Client(): S3Client {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || "us-east-1";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("S3 credentials not configured");
  }

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle,
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
}

// Lazy initialization to avoid errors when env vars are not set
let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = createS3Client();
  }

  return s3Client;
}

export function getS3Config() {
  return {
    bucket: process.env.S3_BUCKET_NAME || "",
    publicUrl: process.env.S3_PUBLIC_URL,
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || "us-east-1",
  };
}
