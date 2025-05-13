"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  MeasurementRuleForm,
  MeasurementRuleFormData,
} from "../_components/measurement-rule-form/measurement-rule-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CustomError } from "@/services/instance";
import { createMeasurementRule } from "@/services/measurement-rule";

export default function NewMeasurementRulePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (
    data: MeasurementRuleFormData,
    redirectTo: "LIST" | "TEMPLATE_NEW"
  ) => {
    try {
      const res = await createMeasurementRule({
        category_large: data.level1,
        category_medium: data.level2,
        category_small: data.level3,
        sleeve_type: data.sleeveType,
        neck_line_type: data.necklineType,
        rule_name: data.name,
        measurement_codes: data.items,
      });

      toast({
        title: "치수 규칙 생성 완료",
        description: `"${data.name}" 치수 규칙이 성공적으로 저장되었습니다.`,
      });

      queryClient.invalidateQueries();

      switch (redirectTo) {
        case "LIST":
          router.push(`/measurement-rules`);
          router.refresh();
          break;
        case "TEMPLATE_NEW":
          router.push(
            `/templates/new?ruleId=${encodeURIComponent(res.data.id)}`
          );
          break;
      }
    } catch (err) {
      if (err instanceof CustomError) {
        if (err.error === "RULE_NAME_DUPLICATE") {
          throw err;
        }
      }

      toast({
        title: "치수 규칙 생성 실패",
        description: "치수 규칙 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">새 치수 규칙 추가</h1>
        <p className="text-muted-foreground">
          새로운 치수 규칙을 생성합니다. 규칙을 저장한 후 바로 이 규칙을
          사용하는 템플릿을 생성할 수도 있습니다.
        </p>
      </div>

      <Alert
        variant="default"
        className="bg-blue-50 border-blue-200 text-blue-800"
      >
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>중복 방지:</strong> 동일한 카테고리와 소매 유형 조합으로 이미
          규칙이 존재하는 경우 중복 생성이 방지됩니다.
        </AlertDescription>
      </Alert>

      <MeasurementRuleForm
        onSubmit={(data, createTemplate) =>
          handleSubmit(data, createTemplate ? "TEMPLATE_NEW" : "LIST")
        }
      />
    </div>
  );
}
