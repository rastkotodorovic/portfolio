import { Column } from "@once-ui-system/core";
import { ProjectCard } from "@/components";
import { getPublishedProjects } from "@/lib/db/posts";
import { person } from "@/resources";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
}

export async function Projects({ range, exclude }: ProjectsProps) {
  let allProjects = await getPublishedProjects();

  // Exclude by slug (exact match)
  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((project) => !exclude.includes(project.slug));
  }

  const displayedProjects = range
    ? allProjects.slice(range[0] - 1, range[1] ?? allProjects.length)
    : allProjects;

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedProjects.map((project, index) => (
        <ProjectCard
          priority={index < 2}
          key={project.slug}
          href={`/work/${project.slug}`}
          images={[
            ...(project.coverImage ? [project.coverImage] : []),
            ...(project.images || []),
          ]}
          title={project.title}
          description={project.summary}
          content={project.content || ""}
          avatars={[{ src: person.avatar }]}
          link={project.link || ""}
        />
      ))}
    </Column>
  );
}
