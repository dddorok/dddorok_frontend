"use client";

import { useQuery } from "@tanstack/react-query";

import { ChartList } from "./ChartList";
import { TemporaryOverlay } from "./TemporaryOverlay";

import { projectQueries } from "@/queries/project";

export function ProjectEditClient({ id }: { id: string }) {
  const { data: project } = useQuery({
    ...projectQueries.project(id),
  });

  if (!project) {
    return <div></div>;
  }

  return (
    <>
      {project.is_temporary && <TemporaryOverlay />}
      <ChartList project={project} />
    </>
  );
}
