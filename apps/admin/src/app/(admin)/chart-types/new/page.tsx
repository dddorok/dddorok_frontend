"use client";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";

import InformationForm from "./information-form";
import SvgMappingForm from "./svg-mapping-form";

import { measurementRuleQueries } from "@/queries/measurement-rule";
import { createChartType, uploadSvg } from "@/services/chart-type";

type FormDataType = {
  type: "몸판" | "소매";
  detailType: string;
  chartName: string;
  measurementRule?: string;
  selectedMeasurements?: string[];
  measurementRuleName?: string;
};

export default function NewChartTypePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType | null>(null);
  console.log("formData: ", formData);

  const onSubmit = async (data: any) => {
    if (!formData || !data) return;

    if (!data.file) return;

    const resourceId = await uploadSvg(data.file);

    await createChartType({
      category_large: "의류",
      category_medium: "상의",
      section: formData.type === "몸판" ? "BODY" : "SLEEVE",
      detail_type: formData.detailType,
      name: formData.chartName,
      measurement_rule_id: formData.measurementRule ?? "",
      measurement_code_maps: data.paths.map(
        (item: { path: { id: string }; selectedMeasurement: string }) => ({
          measurement_code: item.selectedMeasurement,
          path_id: item.path.id,
        })
      ),
      resource_id: resourceId,
    });
  };

  return (
    <>
      {step === 1 && (
        <InformationForm
          onSubmit={(data) => {
            setFormData({
              ...data,
              type: data.type,
              detailType:
                data.type === "몸판"
                  ? data.bodyDetailType
                  : data.retailDetailType,
            });
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
    enabled: Boolean(formData?.measurementRule) && formData?.type === "몸판",
    ...measurementRuleQueries.getMeasurementRuleByIdQueryOptions(
      formData.measurementRule ?? ""
    ),
  });
  const { data: measurementRuleItemCodeList } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleItemCodeQueryOptions(),
    enabled: formData.type === "소매",
  });

  console.log("measurementRuleItemCodeList: ", measurementRuleItemCodeList);
  console.log("formData: ", formData);
  const measurementList =
    formData?.type === "몸판"
      ? measurementRuleList?.items
      : measurementRuleItemCodeList?.filter((item) =>
          formData.selectedMeasurements?.includes(item.code)
        );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SvgMappingForm
        onSubmit={onSubmit}
        measurementCodeList={measurementList ?? []}
      />
    </Suspense>
  );
}
