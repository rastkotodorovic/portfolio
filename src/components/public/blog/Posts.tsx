import { Grid } from "@once-ui-system/core";
import Post from "./Post";
import { getPublishedBlogPosts } from "@/lib/db/posts";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
}

export async function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
}: PostsProps) {
  const dbPosts = await getPublishedBlogPosts();

  // Map DB posts to the expected format
  let allBlogs = dbPosts.map((post) => ({
    slug: post.slug,
    content: post.content || "",
    metadata: {
      title: post.title,
      publishedAt: post.publishedAt.toISOString(),
      summary: post.summary,
      tag: post.tag,
      image: post.coverImage || undefined,
    },
  }));

  // Exclude by slug (exact match)
  if (exclude.length) {
    allBlogs = allBlogs.filter((post) => !exclude.includes(post.slug));
  }

  const displayedBlogs = range
    ? allBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : allBlogs.length)
    : allBlogs;

  return (
    <>
      {displayedBlogs.length > 0 && (
        <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {displayedBlogs.map((post) => (
            <Post key={post.slug} post={post} thumbnail={thumbnail} direction={direction} />
          ))}
        </Grid>
      )}
    </>
  );
}
