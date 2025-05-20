"use client";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import * as z from "zod";

import { ChartTypeSelect } from "./ChartTypeSelect";

import {
  CommonRadioListField,
  CommonSelectField,
} from "@/components/CommonFormField";
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
  ChartType,
  ChartTypeMapSchema,
  CONSTRUCTION_METHOD,
  CONSTRUCTION_METHOD_OPTIONS,
  ConstructionMethodSchema,
  NEEDLE_OPTIONS,
  NeedleType,
  NeedleTypeSchema,
} from "@/constants/template";
import { toast } from "@/hooks/use-toast";

const templateFormSchema = z.object({
  name: z.string().min(1, "템플릿 이름을 입력해주세요"),
  measurementRuleId: z.string().min(1, "치수 규칙을 선택해주세요"),
  needleType: NeedleTypeSchema,
  constructionPrimary: ConstructionMethodSchema.extract([
    "TOP_DOWN",
    "BOTTOM_UP",
  ]),
  constructionSecondary: ConstructionMethodSchema.extract(["PIECED", "ROUND"]),
  chartTypeMaps: z.array(ChartTypeMapSchema).min(1, "차트 유형을 선택해주세요"),
});

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
  onSubmit,
  initialTemplate,
}: TemplateFormProps) {
  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: initialTemplate?.name || "",
      needleType: "KNITTING",
      // constructionMethods: initialTemplate?.constructionMethods || [],
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
        // if (request.constructionMethods.length === 0) {
        //   // throw new Error("상의 제작 방식을 1개 이상 입력해주세요.");
        //   form.setError("constructionMethods", {
        //     message: "상의 제작 방식을 1개 이상 입력해주세요.",
        //   });
        //   return;
        // }
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

            <CommonSelectField
              name="needleType"
              label="도구 유형"
              placeholder="도구 유형을 선택하세요"
              options={NEEDLE_OPTIONS}
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

        <ChartTypeSelect chartTypeMapsName="chartTypeMaps" />

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
  const list = [formData.constructionPrimary, formData.constructionSecondary]
    ?.filter(Boolean)
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

  // useEffect(() => {
  //   // 필드가 비활성화될 때 값 초기화
  //   // if (!isConstructionMethodEnabled) {
  //   //   form.setValue("constructionPrimary", "NONE");
  //   //   form.setValue("constructionSecondary", "NONE");
  //   // }
  // }, [isConstructionMethodEnabled]);

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
        <CommonRadioListField
          name="constructionPrimary"
          label="제작 방식 1"
          options={[
            CONSTRUCTION_METHOD.TOP_DOWN,
            CONSTRUCTION_METHOD.BOTTOM_UP,
          ]}
          className="flex"
        />
        <CommonRadioListField
          name="constructionSecondary"
          label="제작 방식 2"
          options={[CONSTRUCTION_METHOD.PIECED, CONSTRUCTION_METHOD.ROUND]}
          className="flex "
        />
        {/* {Object.values(CONSTRUCTION_METHOD_OPTIONS).map((option) => (
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
            ))} */}
      </CardContent>
    </Card>
  );
}
