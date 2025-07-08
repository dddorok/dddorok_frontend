"use client";

import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { ChartList } from "./ChartList";
import { TemporaryOverlay } from "./TemporaryOverlay";

import { Button } from "@/components/ui/button";
import { projectQueries } from "@/queries/project";

export function ProjectEditClient({ id }: { id: string }) {
  const router = useRouter();

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
        <div>
          <Button color="trans" onClick={() => router.back()}>
            <XIcon className="w-[22px] h-[22px] text-neutral-N500" />
          </Button>
        </div>
      </div>
      <div className="h-[100px]"></div>
      <ChartList project={project} />
    </>
  );
}
