"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { SectionType } from "./constants";
import InformationForm from "./information-form";
import SvgMappingForm from "./svg-mapping-form";
import { SvgUpload } from "./svg-upload";

import { toast, useToast } from "@/hooks/use-toast";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { createChartType, uploadSvg } from "@/services/chart-type";
import { GetMeasurementRuleItemCodeResponse } from "@/services/measurement-rule";

type FormDataType = {
  section: SectionType;
  detailType: string;
  chartName: string;
  measurementRuleId?: string;
  selectedMeasurements?: string[];
  measurementRuleName?: string;
};

export default function NewChartTypePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType | null>(null);
  const [pathData, setPathData] = useState<{
    pathIds: string[];
    file: File | null;
    svgContent: string;
  } | null>(null);

  const measurementList = useSelectedMeasurements(formData);
  console.log("measurementList: ", measurementList);

  const onSubmit = async (data: {
    file: File | null;
    paths: { pathId: string; selectedMeasurement: string }[];
  }) => {
    if (!formData || !data) return;

    if (!data.file) return;

    try {
      const resourceId = await uploadSvg(data.file);

      await createChartType({
        category_large: "의류",
        category_medium: "상의",
        section: formData.section,
        detail_type: formData.detailType,
        name: formData.chartName,
        measurement_rule_id: formData.measurementRuleId
          ? formData.measurementRuleId
          : undefined,
        measurement_code_maps: data.paths.map((item) => ({
          measurement_code: item.selectedMeasurement,
          path_id: item.pathId,
        })),
        resource_id: resourceId,
      });

      toast({
        title: "차트 타입 생성 완료",
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

  return (
    <>
      {step === 1 && (
        <InformationForm
          onSubmit={(data) => {
            console.log(data);
            setFormData({
              ...data,
              section: data.section,
              detailType: data.detailType,
              chartName: data.chartName,
              measurementRuleId: data.measurementRuleId,
            });
            setStep(2);
          }}
        />
      )}

      {step === 2 && formData && (
        <Suspense fallback={<div>Loading...</div>}>
          <SvgUpload
            onSubmit={(data) => {
              if (data.pathIds.length > measurementList.length) {
                toast({
                  variant: "destructive",
                  title:
                    "Path 개수가 측정항목 개수보다 많습니다. 다시 확인해주세요.",
                  description: `Path 개수: ${data.pathIds.length}, 측정항목 개수: ${measurementList.length}`,
                });
                return;
              }
              setPathData(data);
              setStep(3);
            }}
          />
        </Suspense>
      )}
      {step === 3 && formData && pathData && (
        <Suspense fallback={<div>Loading...</div>}>
          <SvgMappingForm
            pathData={pathData}
            onSubmit={onSubmit}
            measurementCodeList={measurementList ?? []}
          />
        </Suspense>
      )}
    </>
  );
}

const useSelectedMeasurements = (formData: FormDataType | null) => {
  const { data: measurementRuleList } = useQuery({
    ...measurementRuleQueries.ruleById(formData?.measurementRuleId ?? ""),
    enabled: Boolean(formData?.measurementRuleId),
  });
  const { data: measurementRuleItemCodeList } = useQuery({
    ...measurementRuleQueries.itemCode(),
    // enabled: formData.section === "SLEEVE",
  });

  const measurementList = formData?.measurementRuleId
    ? measurementRuleList?.items
    : measurementRuleItemCodeList?.filter((item) =>
        formData?.selectedMeasurements?.includes(item.code)
      );

  return measurementList ?? [];
};
