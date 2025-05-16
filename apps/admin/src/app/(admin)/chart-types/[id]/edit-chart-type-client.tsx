"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import SvgMappingForm from "./svg-mapping-form";

import { toast } from "@/hooks/use-toast";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import {
  GetChartTypeResponse,
  updateMeasurementCodeMaps,
} from "@/services/chart-type";

type FormDataType = {
  type: "몸판" | "소매";
  detailType: string;
  chartName: string;
  measurementRule?: string;
  selectedMeasurements?: string[];
  measurementRuleName?: string;
};

export function EditChartTypeForm({
  chartType: initialChartType,
}: {
  chartType: GetChartTypeResponse;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataType | null>({
    type: initialChartType.section === "BODY" ? "몸판" : "소매",
    detailType: initialChartType.detail_type,
    chartName: initialChartType.name,
    measurementRule: undefined,
    selectedMeasurements: initialChartType.measurement_code_maps?.map(
      (map) => map.measurement_code
    ),
  });

  const onSubmit = async (data: {
    paths: { pathId: string; selectedMeasurement: string }[];
  }) => {
    await updateMeasurementCodeMaps({
      id: initialChartType.id,
      measurement_code_maps: data.paths.map((item) => ({
        measurement_code: item.selectedMeasurement,
        path_id: item.pathId,
      })),
    });
    toast({
      title: "측정항목 매핑 업데이트 완료",
    });
    router.push(`/chart-types`);
  };
  const { data: measurementRuleItemCodeList } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleItemCodeQueryOptions(),
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
      {formData && (
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
      )}
    </>
  );
}
