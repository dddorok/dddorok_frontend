import { useQuery } from "@tanstack/react-query";

import { projectQueries } from "@/queries/project";

export function ProjectClient({ id }: { id: string }) {
  const { data: project } = useQuery({
    ...projectQueries.project(id),
  });

  if (!project) {
    return <div>Loading...</div>;
  }

  return <div>{project.name}</div>;
}
