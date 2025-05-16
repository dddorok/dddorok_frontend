"use client";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";

import { GROUPPING_MEASUREMENT, Measurement } from "./constants";
import InformationForm from "./information-form";
import SvgMappingForm from "./svg-mapping-form";

import { measurementRuleQueries } from "@/queries/measurement-rule";
import { createChartType, uploadSvg } from "@/services/chart-type";
import { getFileToBase64 } from "@/utils/file";

interface FormDataType {
  type: "몸판" | "소매";
  // 몸판
  bodyDetailType: string;
  measurementRule: string;
  measurementRuleName: string;
  chartName: string;
}

export default function NewChartTypePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType | null>(null);
  console.log("formData: ", formData);

  const onSubmit = async (data: any) => {
    if (!formData || !data) return;

    if (!data.file) return;

    const resourceId = "01422c5d-dc79-4ed2-ad43-9c139f1f50cd";

    const hartType = await createChartType({
      category_large: "의류",
      category_medium: "상의",
      section: formData.type === "몸판" ? "BODY" : "SLEEVE",
      detail_type: formData.bodyDetailType,
      name: formData.chartName,
      measurement_rule_id: formData.measurementRule,
      measurement_code_maps: data.paths.map(
        (item: { path: { id: string }; selectedMeasurement: string }) => ({
          measurement_code: item.selectedMeasurement,
          path_id: item.path.id,
        })
      ),
      resource_id: resourceId,
    });
    console.log("hartType: ", hartType);
    // setStep(2);
  };

  return (
    <>
      {step === 1 && (
        <InformationForm
          onSubmit={(data) => {
            setFormData(data as FormDataType);
            setStep(2);
          }}
        />
      )}

      {step === 2 && formData && (
        <Suspense fallback={<div>Loading...</div>}>
          <SvgMappingFormWrapper formData={formData} onSubmit={onSubmit} />
        </Suspense>
      )}
    </>
  );
}

function SvgMappingFormWrapper({
  formData,
  onSubmit,
}: {
  formData: FormDataType;
  onSubmit: (data: any) => void;
}) {
  const { data: measurementRuleList } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleByIdQueryOptions(
      formData.measurementRule
    ),
    enabled: !!formData?.measurementRule && formData?.type === "몸판",
  });
  const { data: measurementRuleItemCodeList } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleItemCodeQueryOptions(),
    enabled: !!formData?.measurementRule && formData.type === "소매",
  });

  const measurementList =
    formData?.type === "몸판" ? measurementRuleList?.items : [];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SvgMappingForm
        onSubmit={onSubmit}
        measurementCodeList={measurementList ?? []}
        measurementRuleId={formData.measurementRule}
      />
    </Suspense>
  );
}
