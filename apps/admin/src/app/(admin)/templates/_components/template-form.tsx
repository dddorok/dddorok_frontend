"use client";

import { AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";

import {
  CHART_TYPE,
  CHART_TYPE_OPTIONS,
  ChartType,
  CONSTRUCTION_METHOD_OPTIONS,
  ConstructionMethodType,
  NEEDLE,
  NEEDLE_OPTIONS,
  NeedleType,
} from "../../../../constants/template";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { type Template, chartTypes } from "@/lib/data";

export interface TemplateFormData {
  name: string;
  needleType: NeedleType | null;
  chartType: ChartType | null;
  measurementRuleId: string;
  constructionMethods: ConstructionMethodType[];
  chartTypeIds: string[];

  isPublished?: boolean; // edit에만 존재
}

interface TemplateFormProps {
  onSubmit: (data: TemplateFormData) => void;
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
  console.log("initialTemplate: ", initialTemplate);
  // Form setup - initialRuleData 처리
  const form = useForm<TemplateFormData>({
    defaultValues: {
      name: initialTemplate?.name || "",
      needleType: initialTemplate?.needleType || null,
      chartType: initialTemplate?.chartType || null,
      constructionMethods: initialTemplate?.constructionMethods || [],
      measurementRuleId: measurementRuleId,
      chartTypeIds: initialTemplate?.chartTypeIds || [],
      isPublished: initialTemplate?.isPublished,
    },
  });

  // 조건부 UI 표시를 위한 상태들
  const [showChartFields] = useState(false); // 차트 유형

  const handleSubmit = () => {
    try {
      onSubmit(form.getValues());
    } catch (error) {
      console.error("error: ", error);
      toast({
        title: "템플릿 저장 실패",
        description: "템플릿 저장에 실패했습니다.",
        variant: "destructive",
      });
    }
    // console.log("[TemplateForm] Form submission initiated:", data);

    // // ID 정규화
    // data.measurementRuleId = String(data.measurementRuleId).trim();
    // console.log(
    //   `[TemplateForm] Using normalized measurementRuleId: "${data.measurementRuleId}"`
    // );
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
            <TemplateNameField />

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
                        form.setValue("chartTypeIds", []);
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TODO: 공개 여부 */}
            {mode === "EDIT" && <PublishStatusSelect />}

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
        {/* 차트 유형 */}
        {showChartFields && (
          <Card>
            <CardHeader>
              <CardTitle>차트 유형 설정</CardTitle>
              <CardDescription>
                필요한 차트 유형을 선택해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chart Type - Multi-select */}
              <FormField
                control={form.control}
                name="chartTypeIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>차트 유형</FormLabel>
                    <FormDescription>
                      차트 유형 관리에 등록된 목록에서 선택할 수 있으며, 다중
                      선택이 가능합니다.
                    </FormDescription>
                    <div className="space-y-2 mt-2">
                      {chartTypes.map((chartType) => (
                        <div
                          key={chartType.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`chart-type-${chartType.id}`}
                            checked={(field.value || []).includes(chartType.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([
                                  ...currentValues,
                                  chartType.id,
                                ]);
                              } else {
                                field.onChange(
                                  currentValues.filter(
                                    (id) => id !== chartType.id
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
            </CardContent>
          </Card>
        )}

        <ChartTypeSelect />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            취소
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            저장
          </Button>
        </div>
      </div>
    </Form>
  );
}

function TemplateNameField() {
  const form = useFormContext<TemplateFormData>();
  const needleType: NeedleType | null = useWatch({ name: "needleType" });
  const chartType: ChartType | null = useWatch({ name: "chartType" });

  useEffect(() => {
    if (!needleType || !chartType) return;
    form.setValue(
      "name",
      `${NEEDLE[needleType].label} ${CHART_TYPE[chartType].label}`
    );
  }, [needleType, chartType]);

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

// TODO: 이건 일단 빈배열로가기, 지금은 서버 준비가 안됨
function ChartTypeSelect() {
  const form = useFormContext<TemplateFormData>();

  // TODO: 차트형 또는 혼합형 패턴 -> 차트 유형 활성화
  // TODO: 필드가 비활성화될 때 값 초기화

  const selectedPatternType = useWatch({ name: "chartType" });
  const chartBasedPattern =
    selectedPatternType === "GRID" || selectedPatternType === "MIXED";

  const measurementItems = []; // TODO: 측정 항목 조회

  console.log("chartBasedPattern: ", chartBasedPattern);
  if (!chartBasedPattern) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>차트 유형 선택</CardTitle>
        <CardDescription>측정 항목과 차트 유형을 설정해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <FormLabel>측정 항목</FormLabel>

          {/* 중요: 치수 규칙 ID를 hidden input으로 추가 */}
          <input type="hidden" {...form.register("measurementRuleId")} />

          <div className="mt-2">
            {form.getValues("measurementRuleId") ? (
              <div className="p-4 border border-blue-100 bg-blue-50 rounded-md text-blue-800">
                <div className="flex items-center gap-2 font-medium">
                  <Info className="h-4 w-4" />
                  <span>
                    자동 설정된 측정 항목 (규칙 ID:{" "}
                    {form.getValues("measurementRuleId")})
                  </span>
                </div>
                <p className="mt-1 text-sm pl-6">
                  치수 규칙에 따라 측정 항목이 자동으로 설정되었습니다.
                  <br />
                  템플릿 저장 이후 각 사이즈별 치수를 설정할 수 있습니다.
                </p>
                {measurementItems?.length && measurementItems.length > 0 && (
                  <div className="mt-2 pl-6 text-sm">
                    <strong>설정된 항목 ({measurementItems.length}개):</strong>{" "}
                    {/* TODO: 측정 항목 조회 */}
                    {/* {measurementItems
                      .map((itemId) => {
                        const item = getMeasurementItemById(itemId);
                        return item ? item.name : itemId;
                      })
                      .join(", ")} */}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  <span>치수 규칙 필요</span>
                </div>
                <p className="mt-1 text-sm pl-6">
                  치수 규칙이 설정되지 않았습니다. 치수 규칙은 필수 항목입니다.
                  <br />
                  템플릿을 생성하려면 먼저 치수 규칙 페이지에서 템플릿 생성
                  버튼을 클릭하세요.
                </p>
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="chartTypeIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>차트 유형</FormLabel>
              <FormDescription>
                차트 유형 관리에 등록된 목록에서 선택할 수 있으며, 다중 선택이
                가능합니다.
              </FormDescription>
              <div className="space-y-2 mt-2">
                {chartTypes.map((chartType) => (
                  <div
                    key={chartType.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`chart-type-${chartType.id}`}
                      checked={(field.value || []).includes(chartType.id)}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) {
                          field.onChange([...currentValues, chartType.id]);
                        } else {
                          field.onChange(
                            currentValues.filter((id) => id !== chartType.id)
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

function PublishStatusSelect() {
  return (
    <FormField
      name="isPublished"
      render={({ field }) => (
        <FormItem>
          <FormLabel>게시 상태</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value === "true")}
            defaultValue={field.value ? "true" : "false"}
            value={field.value ? "true" : "false"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="게시 상태를 선택하세요" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="true">공개</SelectItem>
              <SelectItem value="false">비공개</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
