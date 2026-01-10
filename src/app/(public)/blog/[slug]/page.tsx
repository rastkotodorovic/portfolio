import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import {
  Meta,
  Schema,
  Column,
  Heading,
  HeadingNav,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { Metadata } from "next";
import { Posts } from "@/components/public/blog/Posts";
import { ShareSection } from "@/components/public/blog/ShareSection";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/db/posts";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const post = await getBlogPostBySlug(slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.title,
    description: post.summary,
    baseURL: baseURL,
    image: `/api/og/generate?title=${post.title}`,
    path: `${blog.path}/${post.slug}`,
  });
}

export default async function Blog({ params }: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const post = await getBlogPostBySlug(slugPath);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24">
          <Schema
            as="blogPosting"
            baseURL={baseURL}
            path={`${blog.path}/${post.slug}`}
            title={post.title}
            description={post.summary}
            datePublished={post.publishedAt.toISOString()}
            dateModified={post.updatedAt.toISOString()}
            image={`/api/og/generate?title=${encodeURIComponent(post.title)}`}
            author={{
              name: person.name,
              url: `${baseURL}${about.path}`,
              image: `${baseURL}${person.avatar}`,
            }}
          />
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {formatDate(post.publishedAt.toISOString())}
            </Text>
            <Heading variant="display-strong-m">{post.title}</Heading>
            <Text
              variant="body-default-l"
              onBackground="neutral-weak"
              align="center"
            >
              {post.summary}
            </Text>
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {person.name}
              </Text>
            </Row>
          </Row>
          <Media
            src="/images/projects/project-01/cover-01.jpg"
            alt={post.title}
            aspectRatio="16/9"
            priority
            sizes="(min-width: 768px) 100vw, 768px"
            border="neutral-alpha-weak"
            radius="l"
            marginTop="12"
            marginBottom="8"
          />
          <Column as="article" maxWidth="s">
            {post.content && <CustomMDX source={post.content} />}
          </Column>

          <ShareSection
            title={post.title}
            url={`${baseURL}${blog.path}/${post.slug}`}
          />

          <Column fillWidth gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Text as="h2" id="recent-posts" variant="heading-strong-xl" marginBottom="24">
              Recent posts
            </Text>
            <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>
      <Column
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
