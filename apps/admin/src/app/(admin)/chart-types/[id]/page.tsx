"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { EditChartTypeForm } from "./edit-chart-type-client";

import { chartTypeQueries } from "@/queries/chart-type";

export default function EditChartTypePage() {
  const { id } = useParams();

  const { data: chartType } = useQuery({
    ...chartTypeQueries.getChartTypeQueryOptions(id as string),
    enabled: !!id,
  });

  if (!chartType) {
    return <div>Chart type not found</div>;
  }

  return (
    <>
      <EditChartTypeForm chartType={chartType} />
    </>
  );
}
