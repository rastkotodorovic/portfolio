import { notFound } from "next/navigation";
import {
  Meta,
  Schema,
  AvatarGroup,
  Column,
  Heading,
  Media,
  Text,
  SmartLink,
  Row,
  Line,
} from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { Metadata } from "next";
import { Projects } from "@/components/public/work/Projects";
import { getProjectBySlug, getPublishedProjects } from "@/lib/db/posts";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({
    slug: project.slug,
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

  const project = await getProjectBySlug(slugPath);

  if (!project) return {};

  return Meta.generate({
    title: project.title,
    description: project.summary,
    baseURL: baseURL,
    image: `/api/og/generate?title=${project.title}`,
    path: `${work.path}/${project.slug}`,
  });
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const project = await getProjectBySlug(slugPath);

  if (!project || project.status !== "published") {
    notFound();
  }

  const avatars = [{ src: person.avatar }];

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        path={`${work.path}/${project.slug}`}
        title={project.title}
        description={project.summary}
        datePublished={project.publishedAt.toISOString()}
        dateModified={project.updatedAt.toISOString()}
        image={`/api/og/generate?title=${encodeURIComponent(project.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <SmartLink href="/work">
          <Text variant="label-strong-m">Projects</Text>
        </SmartLink>
        <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
          {formatDate(project.publishedAt.toISOString())}
        </Text>
        <Heading variant="display-strong-m">{project.title}</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak" marginTop="16">
          {project.summary}
        </Text>
      </Column>
      <Row marginBottom="32" horizontal="center">
        <Row gap="16" vertical="center">
          <AvatarGroup reverse avatars={avatars} size="s" />
          <Text variant="label-default-m" onBackground="brand-weak">
            {person.name}
          </Text>
        </Row>
      </Row>
      {(project.coverImage || (project.images && project.images.length > 0)) && (
        <Media
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={project.title}
          src={project.coverImage || project.images?.[0] || ""}
        />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        {project.content && <CustomMDX source={project.content} />}
      </Column>
      {project.link && (
        <SmartLink href={project.link} target="_blank">
          <Text variant="label-strong-m">View project →</Text>
        </SmartLink>
      )}
      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Related projects
        </Heading>
        <Projects exclude={[project.slug]} range={[1, 2]} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
