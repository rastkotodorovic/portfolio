import type { MetadataRoute } from "next";

const siteUrl =
  process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://demo.magic-portfolio.com";

const isIndexable =
  process.env.SITE_INDEXABLE === "true" || process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl.replace(/\/+$/, "")}/sitemap.xml`,
  };
}
