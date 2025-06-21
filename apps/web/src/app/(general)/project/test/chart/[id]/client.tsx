"use client";

import { useQuery } from "@tanstack/react-query";

import { projectQueries } from "@/queries/project";

export default function ChartPageClient({ id }: { id: string }) {
  const { data: chart } = useQuery({
    ...projectQueries.chart(id),
  });

  return <div>{chart?.name}</div>;
}
