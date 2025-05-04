"use client";

import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AlertCircle, Info } from "lucide-react";
import { data } from "motion/react-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  MeasurementRuleForm,
  MeasurementRuleFormData,
} from "../_components/measurement-rule-form/measurement-rule-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { NecklineType, SleeveType } from "@/lib/data";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { updateMeasurementRule } from "@/services/measurement-rule";

interface EditMeasurementRuleClientProps {
  id: string;
}

export default function EditMeasurementRuleClient({
  id,
}: EditMeasurementRuleClientProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const { data: rule } = useQuery(
    measurementRuleQueries.getMeasurementRuleByIdQueryOptions(id)
  );

  const handleSubmit = async (data: MeasurementRuleFormData) => {
    try {
      await updateMeasurementRule(id, {
        category_large: data.level1,
        category_medium: data.level2,
        category_small: data.level3,
        rule_name: data.name,
        measurement_codes: data.items,
        sleeve_type: data.sleeveType,
        neck_line_type: data.necklineType,
      });
      toast({
        title: "치수 규칙 수정 완료",
        description: `"${data.name}" 치수 규칙이 성공적으로 업데이트되었습니다.`,
      });
      queryClient.invalidateQueries();
      router.push(`/measurement-rules`);
    } catch (error) {
      console.error("Error updating measurement rule:", error);
    }

    console.log("data: ", data);
  };

  // TODO: Error boundary 추가
  // if (notFound) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertCircle className="h-4 w-4" />
  //       <AlertTitle>오류</AlertTitle>
  //       <AlertDescription>
  //         해당 ID의 측정 규칙을 찾을 수 없습니다.
  //       </AlertDescription>
  //     </Alert>
  //   );
  // }

  if (rule === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">치수 규칙 편집</h1>
        <p className="text-muted-foreground">측정 규칙을 수정합니다.</p>
      </div>

      <Alert
        variant="default"
        className="bg-blue-50 border-blue-200 text-blue-800"
      >
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>중복 방지:</strong> 수정 시에도 동일한 카테고리와 소매 유형
          조합으로 이미 다른 규칙이 존재하는 경우 중복 생성이 방지됩니다.
        </AlertDescription>
      </Alert>

      {rule && (
        <MeasurementRuleForm
          initialValues={{
            id: rule.id,
            categoryId: rule.category_large,
            name: rule.rule_name,
            level1: rule.category_large,
            level2: rule.category_medium,
            level3: rule.category_small,
            items: rule.items.map((item) => item.code),
            sleeveType: rule.sleeve_type as SleeveType,
            necklineType: rule.neck_line_type as NecklineType,
          }}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      )}
    </div>
  );
}
