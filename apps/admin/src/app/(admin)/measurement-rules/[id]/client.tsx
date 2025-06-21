"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  MeasurementRuleForm,
  MeasurementRuleFormData,
} from "./measurement-rule-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { NecklineType, SleeveType } from "@/constants/top";
import { useToast } from "@/hooks/use-toast";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { CustomError } from "@/services/instance";
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

  const { data: rule } = useQuery(measurementRuleQueries.ruleById(id));

  const handleSubmit = async (data: MeasurementRuleFormData) => {
    if (!rule) return;

    try {
      await updateMeasurementRule(id, {
        category_large: rule.category_large,
        category_medium: rule.category_medium,
        category_small: rule.category_small,
        rule_name: rule.rule_name,
        measurement_codes: data.items,
        sleeve_type: rule.sleeve_type as SleeveType,
        neck_line_type: rule.neck_line_type as NecklineType,
      });
      toast({
        title: "치수 규칙 수정 완료",
        description: `"${rule.rule_name}" 치수 규칙이 성공적으로 업데이트되었습니다.`,
      });
      queryClient.invalidateQueries();
      router.push(`/measurement-rules`);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.error === "RULE_NAME_DUPLICATE") {
          throw error;
        }
      }

      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "치수 규칙 수정 실패",
          description: error.message,
        });
      }
    }
  };

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
        <MeasurementRuleForm initialValues={rule} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
