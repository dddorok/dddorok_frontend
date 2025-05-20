"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import {
  TemplateForm,
  TemplateFormData,
} from "@/app/(admin)/templates/_components/template-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NECKLINE, SLEEVE } from "@/constants/top";
import { useToast } from "@/hooks/use-toast";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { GetMeasurementRuleListItemType } from "@/services/measurement-rule";
import { createTemplate } from "@/services/template/template";

export default function NewTemplateClient({
  initRuleId,
}: {
  initRuleId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [ruleName, setRuleName] = useState<string>("");
  const [selectedRule, setSelectedRule] = useState<string | null>(
    initRuleId || null
  );

  const { data: rule } = useQuery({
    ...measurementRuleQueries.ruleById(selectedRule || ""),
    enabled: !!selectedRule,
  });

  const initialTemplateName = [
    rule?.neck_line_type
      ? NECKLINE[rule.neck_line_type as keyof typeof NECKLINE].label
      : "",
    rule?.sleeve_type
      ? SLEEVE[rule.sleeve_type as keyof typeof SLEEVE].label
      : "",
    rule?.category_small,
  ]
    .filter(Boolean)
    .join(" ");

  // 치수 규칙 선택 처리 함수
  const handleSelectRule = async (rule: GetMeasurementRuleListItemType) => {
    console.log("Selected rule:", rule);

    setSelectedRule(rule.id);
    setRuleName(rule.rule_name);
  };

  const handleSubmit = async (data: TemplateFormData) => {
    // setIsSubmitting(true);

    if (!data.needleType) {
      throw new Error("입력 필드가 비어있습니다.");
    }

    // if (data.chartType === "GRID" || data.chartType === "MIXED") {
    //   if (!data.chartTypeMaps?.length || data.chartTypeMaps.length === 0) {
    //     throw new Error("차트 유형을 선택해주세요.");
    //   }
    // }

    const request = {
      name: data.name,
      needle_type: data.needleType,
      // chart_type: "NONE" as const,
      measurement_rule_id: data.measurementRuleId,
      // construction_methods: data.constructionMethods,
      construction_primary: data.constructionPrimary,
      construction_secondary: data.constructionSecondary,
      chart_type_maps: data.chartTypeMaps ?? [],
    };
    await createTemplate(request);

    toast({
      title: "템플릿 저장 성공",
      description: `"${data.name}" 템플릿이 생성되었습니다.`,
    });
    router.push("/templates");
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
        <Suspense>
          <SelectMeasurementRule handleSelectRule={handleSelectRule} />
        </Suspense>
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
            initialTemplate={{
              name: initialTemplateName,
            }}
            measurementRuleId={selectedRule}
            category={{
              level1: rule.category_large,
              level2: rule.category_medium,
              level3: rule.category_small,
            }}
            mode="CREATE"
          />
        </div>
      )}
    </div>
  );
}

function SelectMeasurementRule({
  handleSelectRule,
}: {
  handleSelectRule: (rule: GetMeasurementRuleListItemType) => void;
}) {
  const { data } = useSuspenseQuery({
    ...measurementRuleQueries.list(),
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
