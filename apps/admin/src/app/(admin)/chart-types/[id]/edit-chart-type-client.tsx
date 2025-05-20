"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

import SvgMappingForm from "./svg-mapping-form";

import { toast } from "@/hooks/use-toast";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import {
  GetChartTypeResponse,
  updateMeasurementCodeMaps,
} from "@/services/chart-type";

export function EditChartTypeForm({
  chartType: initialChartType,
}: {
  chartType: GetChartTypeResponse;
}) {
  const router = useRouter();
  const onSubmit = async (data: {
    paths: { pathId: string; selectedMeasurement: string | null }[];
  }) => {
    await updateMeasurementCodeMaps({
      id: initialChartType.id,
      measurement_code_maps: data.paths.map((item) => ({
        measurement_code: item.selectedMeasurement ?? "",
        path_id: item.pathId,
      })),
    });
    toast({
      title: "측정항목 매핑 업데이트 완료",
    });
    router.push(`/chart-types`);
  };
  const { data: measurementRuleItemCodeList } = useQuery({
    ...measurementRuleQueries.itemCode(),
  });

  const codeObj =
    measurementRuleItemCodeList?.reduce(
      (acc, item) => {
        acc[item.code] = item.label;
        return acc;
      },
      {} as Record<string, string>
    ) ?? {};

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <SvgMappingForm
          onSubmit={onSubmit}
          measurementCodeList={
            initialChartType.measurement_code_maps?.map((map) => ({
              label: codeObj[map.measurement_code] ?? "",
              value: map.measurement_code,
            })) ?? []
          }
          svgFileUrl={initialChartType.svg_file_url}
          measurementCodeMaps={initialChartType.measurement_code_maps}
        />
      </Suspense>
    </>
  );
}
