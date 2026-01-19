import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production", // Needed for rendering s3 images locally from MinIO
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
      // S3-compatible storage patterns
      // AWS S3
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "**",
      },
      // Cloudflare R2
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        pathname: "**",
      },
      // DigitalOcean Spaces
      {
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
        pathname: "**",
      },
      // Backblaze B2
      {
        protocol: "https",
        hostname: "*.backblazeb2.com",
        pathname: "**",
      },
      // MinIO (local development)
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9000",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default withMDX(nextConfig);
