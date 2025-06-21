"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { projectQueries } from "@/queries/project";

export default function ProjectDetailClient({ id }: { id: string }) {
  const { data: project } = useQuery({
    ...projectQueries.project(id),
  });
  console.log("project: ", project);
  return (
    <div>
      <h1>{project?.name}</h1>
      <div>
        {project?.chart_list.map((chart) => (
          <div key={chart.chart_id}>
            <div>{chart.name}</div>
            <Button asChild>
              <Link href={`/project/test/chart/${chart.chart_id}`}>이동</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
