"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, CheckSquare } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useForm, useFormContext, useFormState } from "react-hook-form";
import * as z from "zod";

import { MeasurementRuleDefaultSection } from "./default-section";

import { BasicAlert } from "@/components/Alert";
import { MeasurementRuleSelectSection } from "@/components/rule/MeasurementRuleSelectSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { categories } from "@/constants/category";
import { getCategoryById } from "@/constants/category";
import { NecklineTypeSchema, SleeveTypeSchema } from "@/constants/top";
import { QueryDevTools } from "@/lib/react-query";
import { CustomError } from "@/services/instance";

interface MeasurementRuleFormProps {
  initialValues?: MeasurementRuleFormData;
  isEdit?: boolean;
  onSubmit: (
    data: MeasurementRuleFormData,
    createTemplate: boolean
  ) => Promise<void>;
}

const measurementRuleSchema = z
  .object({
    level1: z.string().min(1, "대분류를 선택해주세요"),
    level2: z.string().min(1, "중분류를 선택해주세요"),
    level3: z.string().min(1, "소분류를 선택해주세요"),
    sleeveType: SleeveTypeSchema.optional(),
    necklineType: NecklineTypeSchema.optional(),
    name: z.string().min(1, "규칙 이름을 입력해주세요"),
    items: z
      .array(z.string())
      .min(1, "최소 1개 이상의 치수 항목을 선택해주세요"),
  })
  .superRefine((data, ctx) => {
    if (data.level2 === "상의" && !data.sleeveType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sleeveType"],
        message: "소매 유형을 선택해주세요.",
      });
    }
    if (data.level2 === "상의" && !data.necklineType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["necklineType"],
        message: "넥라인 유형을 선택해주세요.",
      });
    }
  });

export type MeasurementRuleFormData = z.infer<typeof measurementRuleSchema>;

/**
 * TODO: edit과 공통 부분은 리팩토링 해야함.
 */
export function MeasurementRuleForm({
  initialValues,
  isEdit = false,
  onSubmit,
}: MeasurementRuleFormProps) {
  const form = useForm<z.infer<typeof measurementRuleSchema>>({
    resolver: zodResolver(measurementRuleSchema),
    defaultValues: initialValues || {
      name: "",
      items: [],
      level1: categories[0]?.id || "",
      level2: categories[0]?.children?.[0]?.id || "",
    },
    mode: "onSubmit",
    shouldFocusError: true,
  });

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
            {form.formState.errors["root"] && (
              <BasicAlert
                variant="destructive"
                iconElement={<Info className="h-4 w-4" />}
              >
                선택한 카테고리와 소매 유형의 조합으로 이미 치수 규칙이
                존재합니다.
                <br /> 다른 조합을 선택해주세요.
              </BasicAlert>
            )}

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
            {form.formState.errors["items"] && (
              <BasicAlert variant="destructive">
                {form.formState.errors["items"].message}
              </BasicAlert>
            )}

            <MeasurementRuleSelectSection
              selectedItems={form.watch("items")}
              onChange={(items: string[]) =>
                form.setValue("items", items, { shouldValidate: true })
              }
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
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
          <SaveButtons isEdit={isEdit} onSubmit={onSubmit} />
        </div>
      </form>
      <QueryDevTools control={form.control} />
    </Form>
  );
}

function SaveButtons({
  isEdit,
  onSubmit,
}: {
  isEdit: boolean;
  onSubmit: (
    data: MeasurementRuleFormData,
    createTemplate: boolean
  ) => Promise<void>;
}) {
  const form = useFormContext<MeasurementRuleFormData>();

  const handleSubmit = async (
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
      sleeveType: needField?.includes("sleeveType") ? data.sleeveType : "NONE",
      necklineType: needField?.includes("necklineType")
        ? data.necklineType
        : "NONE",
    };

    try {
      await onSubmit(requestData, createTemplate);
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.error === "RULE_NAME_DUPLICATE") {
          form.setError("root", {
            message: "이미 존재하는 규칙 이름입니다.",
          });
          return;
        }
      }
    }
  };

  return (
    <>
      {" "}
      <Button
        type="button"
        onClick={() => {
          form.trigger();
          form.handleSubmit((data) => handleSubmit(data, false))();
        }}
      >
        저장
      </Button>
      {!isEdit && (
        <Button
          type="button"
          variant="default"
          onClick={() => {
            form.trigger();
            form.handleSubmit((data) => handleSubmit(data, true))();
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          저장 후 템플릿 생성
        </Button>
      )}
    </>
  );
}
