"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { SvgUpload } from "../../_components/svg-upload";
import SvgMappingForm from "../../new/svg-mapping-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, useToast } from "@/hooks/use-toast";
import { chartTypeQueries } from "@/queries/chart-type";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import {
  MeasurementCodeMap,
  updateChartType,
  uploadSvg,
} from "@/services/chart-type";

export function UpdateChartTypeClient({ id }: { id: string }) {
  const { data: chartType } = useQuery({
    ...chartTypeQueries.detail(id as string),
    enabled: !!id,
  });

  const measurementCodeCount = chartType?.measurement_code_maps.length ?? 0;

  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(chartType?.name ?? "");
  const [pathData, setPathData] = useState<{
    pathIds: string[];
    file: File | null;
    svgContent: string;
  } | null>(null);

  const measurementList = useSelectedMeasurements(
    chartType?.measurement_code_maps ?? []
  );
  const onSubmit = async (data: {
    file: File | null;
    paths: { pathId: string; selectedMeasurement: string }[];
  }) => {
    if (!data.file) return;

    try {
      const resourceId = await uploadSvg(data.file);

      await updateChartType(id, {
        name,
        svgFileId: resourceId,
        measurement_code_maps: data.paths.map((item) => ({
          measurement_code: item.selectedMeasurement,
          path_id: item.pathId,
        })),
      });

      toast({
        title: "차트 타입 업데이트 완료",
      });
      router.push(`/chart-types`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "차트 타입 생성 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    }
  };

  useEffect(() => {
    setName(chartType?.name ?? "");
  }, [chartType]);

  if (!chartType) {
    return <div>Chart type not found</div>;
  }

  return (
    <div>
      {step === 1 && (
        <SvgUpload
          onSubmit={(data) => {
            if (data.pathIds.length > measurementCodeCount) {
              toast({
                variant: "destructive",
                title:
                  "Path 개수가 측정항목 개수보다 많습니다. 다시 확인해주세요.",
                description: `Path 개수: ${data.pathIds.length}, 측정항목 개수: ${measurementCodeCount}`,
              });
              return;
            }
            setPathData(data);
            // onNext(data);
            setStep(3);
          }}
        />
      )}
      {step === 3 && pathData && (
        <Suspense fallback={<div>Loading...</div>}>
          <div className="space-y-2 mb-4">
            <Label>차트 타입 이름</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="차트 타입 이름"
            />
          </div>
          <SvgMappingForm
            pathData={pathData}
            onSubmit={onSubmit}
            measurementCodeList={measurementList ?? []}
          />
        </Suspense>
      )}
    </div>
  );
}

const useSelectedMeasurements = (measurementCodeMaps: MeasurementCodeMap[]) => {
  const { data: measurementRuleItemCodeList } = useQuery({
    ...measurementRuleQueries.itemCode(),
  });

  const measurementList = measurementRuleItemCodeList?.filter((item) =>
    measurementCodeMaps.some((map) => map.measurement_code === item.code)
  );

  return measurementList ?? [];
};
