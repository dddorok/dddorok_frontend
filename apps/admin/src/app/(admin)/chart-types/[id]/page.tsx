"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { EditChartTypeForm } from "./edit-chart-type-client";

import { Button } from "@/components/ui/button";
import { chartTypeQueries } from "@/queries/chart-type";

export default function EditChartTypePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: chartType } = useQuery({
    ...chartTypeQueries.detail(id as string),
    enabled: !!id,
  });

  if (!chartType) {
    return <div>Chart type not found</div>;
  }

  return (
    <div className="space-y-4">
      <EditChartTypeForm chartType={chartType} />
    </div>
  );
}
