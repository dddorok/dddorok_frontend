"use client";

import { useQuery } from "@tanstack/react-query";

import { projectQueries } from "@/queries/project";

export function ProjectEditClient({ id }: { id: string }) {
  const { data: chart } = useQuery({
    ...projectQueries.chart(id),
  });

  if (!chart) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {chart.id}
      {/* <ChartEdit chart={chart} /> */}
    </>
  );
}
