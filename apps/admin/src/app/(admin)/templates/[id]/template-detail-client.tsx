"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { SizeDetailForm } from "@/app/(admin)/templates/_components/size-detail-form"; // Updated import path
import { getCategoryById } from "@/constants/category";
import { toast } from "@/hooks/use-toast";
import { type Template } from "@/lib/data";
import {
  templateMeasurementValuesQueries,
  templateQueries,
  templateQueryKeys,
} from "@/queries/template";
import {
  TemplateMeasurementValueType,
  updateTemplateMeasurementValues,
} from "@/services/template/measure-value";

interface TemplateDetailClientProps {
  templateId: string;
}

export default function TemplateDetailClient({
  templateId,
}: TemplateDetailClientProps) {
  const queryClient = useQueryClient();
  const { data: template, isLoading } = useQuery({
    ...templateQueries.getTemplateByIdQueryOptions(templateId),
  });
  const { data: measurementValues, isLoading: isLoadingMeasurementValues } =
    useQuery({
      ...templateMeasurementValuesQueries.getTemplateMeasurementValues(
        templateId
      ),
    });

  // 세부 치수 저장 처리
  const handleSaveSizeDetails = async (
    result: TemplateMeasurementValueType[]
  ) => {
    await updateTemplateMeasurementValues(templateId, result);

    toast({
      title: "세부 치수가 저장되었습니다.",
    });
    queryClient.invalidateQueries({
      queryKey: templateQueryKeys.templateMeasurementValues(templateId),
    });
  };

  if (isLoading || isLoadingMeasurementValues) {
    return <div>Loading...</div>;
  }

  if (!template || !measurementValues) {
    // return <div>템플릿을 찾을 수 없습니다.</div>;
    notFound();
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{template.name}</h1>
      </div>

      <SizeDetailForm
        measurementValues={measurementValues}
        onSubmit={handleSaveSizeDetails}
      />
    </div>
  );
}
