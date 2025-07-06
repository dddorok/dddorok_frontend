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
      {project.is_temporary && <TemporaryOverlay project_id={project.id} />}
      <div className="h-[100px] bg-neutral-N0 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="container">
          <div className="text-neutral-N800 text-h3-m">{project.name}</div>
        </div>
        <div></div>
      </div>
      <div className="h-[100px]"></div>
      <ChartList project={project} />
    </>
  );
}
