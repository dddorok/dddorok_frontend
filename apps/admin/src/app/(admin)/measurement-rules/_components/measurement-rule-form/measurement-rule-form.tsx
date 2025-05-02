"use client";

import { DevTool } from "@hookform/devtools";
import { useQuery } from "@tanstack/react-query";
import { Info, CheckSquare } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useState, useEffect, ComponentProps } from "react";
import {
  useController,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";

import { MeasurementRuleDefaultSection } from "./default-section";

import { BasicAlert } from "@/components/Alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type MeasurementRule,
  SLEEVE_TYPES,
  categories,
  getCategoryById,
  type SleeveType,
  isDuplicateMeasurementRule,
  CATEGORY_ID,
  NECKLINE_TYPES,
  NecklineType,
} from "@/lib/data";
import { QueryDevTools } from "@/lib/react-query";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { GetMeasurementRuleItemCodeResponse } from "@/services/measurement-rule";

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
              <div>
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

            <MeasurementRuleSelectForm />
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

function MeasurementRuleSelectForm() {
  const { data: itemCodes } = useQuery(
    measurementRuleQueries.getMeasurementRuleItemCodeQueryOptions()
  );

  const groupedItems = transformMeasurementItems(itemCodes ?? []);
  const [activeTab, setActiveTab] = useState<string>("상의");

  // 측정 항목을 카테고리별로 그룹화
  const itemCategories = Object.keys(groupedItems);
  return (
    <FormItem>
      <Tabs
        defaultValue="상의"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 w-full justify-start gap-1 bg-muted/50 p-1 my-4">
          {itemCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="px-4 py-1.5"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {itemCategories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="space-y-6">
              {Object.keys(groupedItems[category] ?? {}).map((section) => {
                return (
                  <RuleCheckList
                    key={section}
                    sectionName={section}
                    sectionItems={groupedItems[category]?.[section] as any}
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <FormMessage />
    </FormItem>
  );
}

function RuleCheckList({
  sectionItems,
  sectionName,
}: {
  sectionItems: GetMeasurementRuleItemCodeResponse[];
  sectionName: string;
}) {
  const form = useFormContext();
  const selectedItems = useWatch({ name: "items" });

  // 아이템 선택 처리
  const handleItemChange = (itemId: string, checked: boolean) => {
    const currentItems = form.getValues().items || [];
    if (checked) {
      form.setValue("items", [...currentItems, itemId]);
    } else {
      form.setValue(
        "items",
        currentItems.filter((id: string) => id !== itemId)
      );
    }
  };

  // 섹션 항목들이 모두 선택되었는지 확인
  const isSectionFullySelected = () => {
    const currentItems = form.getValues().items || [];
    return sectionItems.every((item) => currentItems.includes(item.id));
  };

  // 섹션 항목들이 일부 선택되었는지 확인
  const isSectionPartiallySelected = () => {
    const currentItems = form.getValues().items || [];
    const selectedCount = sectionItems.filter((item) =>
      currentItems.includes(item.id)
    ).length;
    return selectedCount > 0 && selectedCount < sectionItems.length;
  };

  // 섹션의 모든 항목 선택/해제
  const handleSectionSelectAll = (selected: boolean) => {
    const currentItems = form.getValues().items || [];
    if (selected) {
      // 섹션 항목 모두 추가 (중복 제거)
      const sectionItemIds = sectionItems.map((item) => item.id);
      form.setValue("items", [
        ...new Set([...currentItems, ...sectionItemIds]),
      ]);
    } else {
      // 섹션 항목 모두 제거
      const sectionItemIds = sectionItems.map((item) => item.id);
      form.setValue(
        "items",
        currentItems.filter((id: string) => !sectionItemIds.includes(id))
      );
    }
  };

  const isFullySelected = isSectionFullySelected();
  const isPartiallySelected = isSectionPartiallySelected();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`section-${sectionName}`}
          checked={isFullySelected}
          className={isPartiallySelected ? "opacity-70" : ""}
          onCheckedChange={(checked) => handleSectionSelectAll(!!checked)}
        />
        <label
          htmlFor={`section-${sectionName}`}
          className="font-semibold text-gray-700"
        >
          {sectionName}
        </label>
      </div>
      <Separator className="my-2" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 pl-4">
        {sectionItems?.map((item) => (
          <RuleCheckItem
            key={item.id}
            checked={selectedItems.includes(item.id)}
            item={item}
            onClick={(checked) => handleItemChange(item.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}

function RuleCheckItem({
  checked,
  item,
  onClick,
}: {
  checked: boolean;
  item: GetMeasurementRuleItemCodeResponse;
  onClick: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2 ">
      <Checkbox
        id={`item-${item.id}`}
        checked={checked}
        onCheckedChange={(checked) => onClick(!!checked)}
        className="mt-0.5"
      />
      <div>
        <label
          htmlFor={`item-${item.id}`}
          className="font-medium leading-none cursor-pointer"
        >
          {item.label}
        </label>
      </div>
    </div>
  );
}

interface TransformedMeasurementItems {
  [category: string]: {
    [section: string]: GetMeasurementRuleItemCodeResponse[];
  };
}

function transformMeasurementItems(
  items: GetMeasurementRuleItemCodeResponse[]
): TransformedMeasurementItems {
  return items.reduce<TransformedMeasurementItems>((acc, item) => {
    const { category, section } = item;

    if (!acc[category]) {
      acc[category] = {};
    }

    if (!acc[category][section]) {
      acc[category][section] = [];
    }

    acc[category][section].push(item);

    return acc;
  }, {});
}
