"use client";

import { Info, CheckSquare } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import { MeasurementRuleDefaultSection } from "./default-section";
import { MeasurementRuleSelectSection } from "./rule-select-section";

import { BasicAlert } from "@/components/Alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  type MeasurementRule,
  categories,
  getCategoryById,
  type SleeveType,
  isDuplicateMeasurementRule,
  NecklineType,
} from "@/lib/data";
import { QueryDevTools } from "@/lib/react-query";

interface MeasurementRuleFormProps {
  rule?: MeasurementRule;
  isEdit?: boolean;
  onSubmit: (data: MeasurementRule, createTemplate: boolean) => void;
}

interface MeasurementRuleFormData extends MeasurementRule {
  level1: string;
  level2: string;
  level3: string;
  sleeveType?: SleeveType;
  necklineType?: NecklineType;
  name: string;
}

export function MeasurementRuleForm({
  rule,
  isEdit = false,
  onSubmit,
}: MeasurementRuleFormProps) {
  const form = useForm<MeasurementRuleFormData>({
    defaultValues: rule || {
      id: "",
      categoryId: "",
      name: "",
      items: [],
      level1: categories[0]?.id || "",
      level2: categories[0]?.children?.[0]?.id || "",
    },
  });

  // TODO
  // Edit mode일 경우 초기 카테고리 설정
  // useEffect(() => {
  //   if (rule?.categoryId) {
  //     const category = getCategoryById(rule.categoryId);
  //     if (category) {
  //       const parentCategory = category.parent_id
  //         ? getCategoryById(category.parent_id)
  //         : null;
  //       const grandParentCategory = parentCategory?.parent_id
  //         ? getCategoryById(parentCategory.parent_id)
  //         : null;

  //       setSelectedCategory({
  //         level1: grandParentCategory?.id || null,
  //         level2: parentCategory?.id || null,
  //         level3: category.id,
  //       });
  //     }
  //   }
  // }, [rule]);

  // 중복 체크
  const checkForDuplicates = (
    categoryId: string,
    sleeveType?: SleeveType
  ): boolean => {
    // 수정 모드에서는 자기 자신을 제외하고 중복 체크
    return isDuplicateMeasurementRule(
      categoryId,
      sleeveType,
      isEdit ? rule?.id : undefined
    );
  };

  // Handle form submission
  const handleSubmit = (
    data: MeasurementRuleFormData,
    createTemplate: boolean = false
  ) => {
    // 카테고리 소분류, 중분류, 대분류 선택에 따른 필요 항목 조회
    const needField = [
      ...(getCategoryById(data.level3)?.needFields || []),
      ...(getCategoryById(data.level2)?.needFields || []),
      ...(getCategoryById(data.level1)?.needFields || []),
    ];

    const requestData = {
      ...data,
      id: data.id ?? `rule_${Date.now()}`,
      sleeveType: needField?.includes("sleeveType")
        ? data.sleeveType
        : undefined,
      necklineType: needField?.includes("necklineType")
        ? data.necklineType
        : undefined,
    };

    // 중복 체크
    const isDuplicate = checkForDuplicates(
      requestData.categoryId,
      requestData.sleeveType
    );
    if (isDuplicate) {
      form.setError("name", {
        message: "중복된 규칙입니다.",
      });
      // form.setValue("duplicateError", true);
      // setDuplicateError(true);
      return;
    }

    onSubmit(requestData, createTemplate);
  };

  // 선택된 항목 개수 확인
  const getSelectedItemCount = () => {
    return form.watch("items")?.length || 0;
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>치수 규칙 기본 정보</CardTitle>
            <CardDescription>
              치수 규칙의 기본 정보를 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MeasurementRuleDefaultSection />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle>치수 항목 선택</CardTitle>
                <CardDescription>
                  이 규칙에 필요한 치수 항목을 선택해주세요.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                <CheckSquare className="h-4 w-4" />
                <span>
                  선택된 항목: <strong>{getSelectedItemCount()}</strong>개
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BasicAlert
              variant="default"
              iconElement={<Info className="h-4 w-4" />}
            >
              선택한 카테고리와 소매 유형의 조합으로 이미 치수 규칙이
              존재합니다. 다른 조합을 선택해주세요.
            </BasicAlert>

            <MeasurementRuleSelectSection />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              form.reset();
              window.history.back();
            }}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={() =>
              form.handleSubmit((data) => handleSubmit(data, false))()
            }
          >
            저장
          </Button>
          {!isEdit && (
            <Button
              type="button"
              variant="default"
              onClick={() =>
                form.handleSubmit((data) => handleSubmit(data, true))()
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              저장 후 템플릿 생성
            </Button>
          )}
        </div>
      </form>
      <QueryDevTools control={form.control} />
    </Form>
  );
}
