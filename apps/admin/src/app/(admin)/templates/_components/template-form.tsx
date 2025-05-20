"use client";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import * as z from "zod";

import { ChartTypeOrderDialog } from "./ChartTypeOrderDialog";

import { BasicAlert } from "@/components/Alert";
import { CommonSelect } from "@/components/CommonUI";
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
  CHART_TYPE_OPTIONS,
  ChartType,
  ChartTypeMapSchema,
  ChartTypeSchema,
  CONSTRUCTION_METHOD,
  CONSTRUCTION_METHOD_OPTIONS,
  ConstructionMethodSchema,
  NEEDLE_OPTIONS,
  NeedleType,
  NeedleTypeSchema,
} from "@/constants/template";
import { toast } from "@/hooks/use-toast";
import { chartTypeQueries } from "@/queries/chart-type";

const templateFormSchema = z.object({
  name: z.string().min(1, "템플릿 이름을 입력해주세요"),
  measurementRuleId: z.string().min(1, "치수 규칙을 선택해주세요"),
  needleType: NeedleTypeSchema,
  chartType: ChartTypeSchema,
  constructionMethods: z.array(ConstructionMethodSchema),
  chartTypeMaps: z.array(ChartTypeMapSchema).optional(),
});
// .refine(
//   (data) => {
//     if (data.needleType === "KNITTING") {
//       return data.constructionMethods.length > 1;
//     }
//     return true;
//   },
//   {
//     message: "상의 제작 방식을 1개 이상 입력해주세요.",
//   }
// );

export type TemplateFormData = z.infer<typeof templateFormSchema>;

interface TemplateFormProps {
  onSubmit: (data: TemplateFormData) => Promise<void>;
  measurementRuleId: string;
  category: {
    level1: string;
    level2: string;
    level3: string;
  };
  mode: "CREATE" | "EDIT";
  initialTemplate?: Partial<TemplateFormData>;
}

export function TemplateForm({
  measurementRuleId,
  category,
  mode,
  onSubmit,
  initialTemplate,
}: TemplateFormProps) {
  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: initialTemplate?.name || "",
      needleType: initialTemplate?.needleType,
      chartType: initialTemplate?.chartType,
      constructionMethods: initialTemplate?.constructionMethods || [],
      measurementRuleId: measurementRuleId,
      chartTypeMaps: initialTemplate?.chartTypeMaps || [],
    },
    mode: "onSubmit",
    shouldFocusError: true,
  });

  const handleSubmit = async () => {
    try {
      const request = form.getValues();
      if (!request.needleType) {
        form.setError("needleType", {
          message: "도구 유형을 선택해주세요.",
        });
        return;
      }
      if (request.needleType === "KNITTING") {
        if (request.constructionMethods.length === 0) {
          // throw new Error("상의 제작 방식을 1개 이상 입력해주세요.");
          form.setError("constructionMethods", {
            message: "상의 제작 방식을 1개 이상 입력해주세요.",
          });
          return;
        }
      }
      await onSubmit(request);
    } catch (error) {
      console.error("error: ", error);
      toast({
        title: "템플릿 저장 실패",
        description: "템플릿 저장에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보 입력</CardTitle>
            <CardDescription>
              템플릿의 기본 정보를 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TemplateNameField initialTemplateName={initialTemplate?.name} />

            <FormField
              name="needleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>도구 유형</FormLabel>
                  <CommonSelect<NeedleType>
                    placeholder="도구 유형을 선택하세요"
                    options={NEEDLE_OPTIONS}
                    value={field.value ?? undefined}
                    onChange={(value: NeedleType) => {
                      field.onChange(value);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="chartType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>도안 유형</FormLabel>
                  <CommonSelect<ChartType>
                    placeholder="도안 유형을 선택하세요"
                    options={CHART_TYPE_OPTIONS}
                    defaultValue={field.value ?? undefined}
                    value={field.value ?? undefined}
                    onChange={(value: ChartType) => {
                      field.onChange(value);
                      // 차트 관련 필드 표시 로직 실행
                      const chartBasedPattern = getIsChartBasedPattern(value);
                      // 차트 유형이 선택되지 않았을 때 값 초기화
                      if (!chartBasedPattern) {
                        form.setValue("chartTypeMaps", []);
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>카테고리</FormLabel>
              <div className="p-3 bg-gray-50 rounded-md border text-sm mt-1">
                {getCategoryName(category)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                카테고리는 선택한 치수 규칙에 따라 자동으로 설정됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: 조건부 속성 입력 */}
        <ConstructionMethodSelect category={category} />

        <ChartTypeSelect />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            취소
          </Button>
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            저장
          </Button>
        </div>
      </div>
      <DevTool control={form.control} />
    </Form>
  );
}

/**
 ** 필드 값을 조합하여 자동 생성
 ** "제작방식(방식 1+방식2 ...)+넥라인+소매유형+소분류"
 ** ex) 바텀업 브이넥 셋인 스웨터, 탑다운 라운드넥 래글런 스웨터
 ** 관리자가 수정 가능하도록 함
 */
const generateTemplateName = (formData: Partial<TemplateFormData>) => {
  const list = formData?.constructionMethods
    ?.filter(Boolean)
    .sort((a) => {
      // 1. 1순위 : 탑다운, 바텀업
      // 2. 2순위 : 조각잇기, 원통형
      if (a === "TOP_DOWN" || a === "BOTTOM_UP") return -1;
      if (a === "PIECED" || a === "ROUND") return 1;
      return 0;
    })
    .map(
      (item) =>
        CONSTRUCTION_METHOD[item as keyof typeof CONSTRUCTION_METHOD].label
    )
    .join(" ");

  return list;
};

function TemplateNameField({
  initialTemplateName,
}: {
  initialTemplateName?: string;
}) {
  const form = useFormContext<TemplateFormData>();

  const formValues = useWatch<TemplateFormData>();
  const templateName =
    generateTemplateName(formValues as TemplateFormData) +
    " " +
    initialTemplateName;
  console.log("initialTemplateName: ", initialTemplateName);

  console.log("templateName: ", templateName);

  useEffect(() => {
    form.setValue("name", templateName, { shouldValidate: true });
  }, [templateName]);

  return (
    <FormField
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>템플릿명</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const getCategoryName = (category: {
  level1: string;
  level2: string;
  level3: string;
}) => {
  return `${category.level1} > ${category.level2} > ${category.level3}`;
};

const getIsChartBasedPattern = (chartType: ChartType) => {
  return chartType === "GRID" || chartType === "MIXED";
};

// // TODO: 이건 일단 빈배열로가기, 지금은 서버 준비가 안됨
function ChartTypeSelect() {
  const form = useFormContext<TemplateFormData>();

  // TODO: 차트형 또는 혼합형 패턴 -> 차트 유형 활성화
  // TODO: 필드가 비활성화될 때 값 초기화

  const selectedPatternType = useWatch({ name: "chartType" });
  const chartBasedPattern =
    selectedPatternType === "GRID" || selectedPatternType === "MIXED";

  const { data: chartTypeList } = useQuery(chartTypeQueries.list());

  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedChartTypes = (form.watch("chartTypeMaps") || [])
    .map((map) => ({
      ...chartTypeList?.find((ct) => ct.id === map.chart_type_id),
      chart_type_id: map.chart_type_id,
      order: map.order,
      name:
        chartTypeList?.find((ct) => ct.id === map.chart_type_id)?.name ?? "",
    }))
    .sort((a, b) => a.order - b.order);

  console.log("selectedChartTypes: ", selectedChartTypes);

  if (!chartBasedPattern) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>차트 유형 선택</CardTitle>
        <CardDescription>차트 유형을 설정해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="chartTypeMaps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>차트 유형</FormLabel>
              <FormDescription>
                차트 유형 관리에 등록된 목록에서 선택할 수 있으며, 다중 선택이
                가능합니다.
              </FormDescription>
              <div className="space-y-2 mt-2">
                {chartTypeList?.map((chartType) => (
                  <div
                    key={chartType.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`chart-type-${chartType.id}`}
                      checked={(field.value || []).some(
                        (map) => map.chart_type_id === chartType.id
                      )}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) {
                          field.onChange([
                            ...currentValues,
                            { chart_type_id: chartType.id, order: 0 },
                          ]);
                        } else {
                          field.onChange(
                            currentValues.filter(
                              (map) => map.chart_type_id !== chartType.id
                            )
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`chart-type-${chartType.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {chartType.name}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="secondary"
          className="mt-2"
          disabled={selectedChartTypes.length < 2}
          onClick={() => setDialogOpen(true)}
        >
          선택한 차트 유형 순서 변경
        </Button>
        <ChartTypeOrderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          chartTypes={selectedChartTypes}
          onSave={(newOrder: { chart_type_id: string; order: number }[]) => {
            // order만 반영, 기타 정보는 기존 chartTypeMaps에서 유지
            const merged = newOrder.map((o) => ({
              ...form
                .watch("chartTypeMaps")
                ?.find((m) => m.chart_type_id === o.chart_type_id),
              order: o.order,
            }));
            form.setValue("chartTypeMaps", merged as any);
          }}
        />
      </CardContent>
    </Card>
  );
}

const getIsConstructionMethodEnabled = ({
  needleType,
  category,
}: {
  needleType: NeedleType;
  category: {
    level1: string;
    level2: string;
    level3: string;
  };
}) => {
  return needleType === "KNITTING" && category.level2 === "상의";
};

/**
 * 상의 제작 방식
 * 대바늘 && 상의 -> 제작 방식 활성화
 * @returns
 */
function ConstructionMethodSelect({
  category,
}: {
  category: {
    level1: string;
    level2: string;
    level3: string;
  };
}) {
  const form = useFormContext<TemplateFormData>();
  const needleType = useWatch({ name: "needleType" });
  const isConstructionMethodEnabled = getIsConstructionMethodEnabled({
    needleType,
    category,
  });

  useEffect(() => {
    // 필드가 비활성화될 때 값 초기화
    if (!isConstructionMethodEnabled) {
      form.setValue("constructionMethods", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConstructionMethodEnabled]);

  if (!isConstructionMethodEnabled) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>상의 제작 방식</CardTitle>
        <CardDescription>
          상의 템플릿의 제작 방식을 선택해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Construction Methods (Multi-select) */}
        {form.formState.errors.constructionMethods && (
          <BasicAlert variant="destructive">
            상의 제작 방식을 1개 이상 입력해주세요.
          </BasicAlert>
        )}
        <div>
          <FormLabel>제작 방식 (다중 선택 가능)</FormLabel>
          <FormDescription>
            적용 가능한 제작 방식을 모두 선택해주세요.
          </FormDescription>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.values(CONSTRUCTION_METHOD_OPTIONS).map((option) => (
              <FormField
                key={option.value}
                name="constructionMethods"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || [];
                            return checked
                              ? field.onChange([...currentValues, option.value])
                              : field.onChange(
                                  currentValues.filter(
                                    (value: string) => value !== option.value
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
