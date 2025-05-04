"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Info, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import type { Template } from "@/lib/data";

import { TemplateForm } from "@/app/(admin)/templates/_components/template-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import {
  GetMeasurementRuleByIdResponse,
  GetMeasurementRuleListItemType,
} from "@/services/measurement-rule";

export default function NewTemplateClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ruleName, setRuleName] = useState<string>("");
  const [selectedRule, setSelectedRule] = useState<string | null>(
    "bc4f2473-c9ba-4d80-ad46-7a93346e36c4"
  );
  console.log("selectedRule: ", selectedRule);

  const { data: rule } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleByIdQueryOptions(
      selectedRule || ""
    ),
    enabled: !!selectedRule,
  });

  // 치수 규칙 선택 처리 함수
  const handleSelectRule = async (rule: GetMeasurementRuleListItemType) => {
    console.log("Selected rule:", rule);

    setSelectedRule(rule.id);
    setRuleName(rule.rule_name);
  };

  const handleSubmit = (data: Template) => {
    setIsSubmitting(true);

    console.log("Template form submitted:", data);
    console.log("MeasurementRuleId:", data.measurementRuleId);

    if (!data.measurementRuleId) {
      toast({
        title: "치수 규칙 필요",
        description:
          "치수 규칙이 선택되지 않았습니다. 치수 규칙을 먼저 선택해주세요.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // 성공 메시지 및 리다이렉트
    toast({
      title: "템플릿 저장 성공",
      description: `"${data.name}" 템플릿이 생성되었습니다.`,
    });

    // Simulate saving with a short delay
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/templates");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">새 템플릿 추가</h1>
        <p className="text-muted-foreground">
          새로운 템플릿을 생성하려면 먼저 치수 규칙을 선택해주세요.
        </p>
      </div>

      {!selectedRule && (
        // 치수 규칙 선택 UI
        <SelectMeasurementRule handleSelectRule={handleSelectRule} />
      )}
      {selectedRule && rule && (
        <div className="space-y-6">
          <SelectedRuleInfo
            ruleName={ruleName}
            selectedRule={selectedRule}
            onOtherRuleSelect={() => setSelectedRule(null)}
          />

          <TemplateForm
            onSubmit={handleSubmit}
            measurementRuleId={selectedRule}
            categoryName={getCategoryName(rule)}
          />
        </div>
      )}
    </div>
  );
}

const getCategoryName = (rule: GetMeasurementRuleByIdResponse) => {
  return `${rule.category_large} > ${rule.category_medium} > ${rule.category_small}`;
};

function SelectMeasurementRule({
  handleSelectRule,
}: {
  handleSelectRule: (rule: GetMeasurementRuleListItemType) => void;
}) {
  const { data } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleListQueryOptions(),
  });

  const measurementRules = data?.data || [];

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>치수 규칙 선택 필요</AlertTitle>
        <AlertDescription>
          템플릿을 생성하려면 먼저 치수 규칙을 선택해야 합니다. 아래 목록에서
          사용할 치수 규칙을 선택해주세요.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <h2 className="text-lg font-medium">사용 가능한 치수 규칙</h2>
        {measurementRules.length === 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>치수 규칙 없음</AlertTitle>
            <AlertDescription>
              사용 가능한 치수 규칙이 없습니다. 먼저 치수 규칙을 생성해주세요.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-3">
            {measurementRules.map((rule) => (
              <Card
                key={rule.id}
                className={`cursor-pointer hover:border-blue-400 transition-colors`}
                onClick={() => handleSelectRule(rule)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{rule.rule_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      측정 항목: {rule.measurement_item_count}개
                      {rule.sleeve_type && ` • 소매 유형: ${rule.sleeve_type}`}
                    </p>
                  </div>
                  {/* {(selectedRule as any)?.id === rule.id && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )} */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectedRuleInfo({
  ruleName,
  selectedRule,
  onOtherRuleSelect,
}: {
  ruleName: string;
  selectedRule: string;
  onOtherRuleSelect: () => void;
}) {
  return (
    <Alert
      variant="default"
      className="bg-blue-50 border-blue-200 text-blue-800"
    >
      <Info className="h-4 w-4" />
      <AlertTitle>치수 규칙 선택됨</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <div>
          <p>
            <strong>{ruleName}</strong> 치수 규칙을 사용하여 템플릿을
            생성합니다.
          </p>
          <p className="text-xs">규칙 ID: {selectedRule}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-300"
          onClick={onOtherRuleSelect}
        >
          다른 규칙 선택
        </Button>
      </AlertDescription>
    </Alert>
  );
}
