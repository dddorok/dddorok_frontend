"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Info, CheckSquare } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import * as z from "zod";

import { MeasurementRuleDefaultSection } from "./default-section";

import { BasicAlert } from "@/components/Alert";
import { MeasurementRuleSelectSection } from "@/components/SelectSection/MeasurementRuleSelectSection";
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
import { NecklineTypeSchema, SleeveTypeSchema } from "@/constants/top";
import { toast } from "@/hooks/use-toast";
import { QueryDevTools } from "@/lib/react-query";
import { CustomError } from "@/services/instance";
import { createMeasurementRule } from "@/services/measurement-rule";

const measurementRuleSchema = z.object({
  level1: z.string().min(1, "대분류를 선택해주세요"),
  level2: z.string().min(1, "중분류를 선택해주세요"),
  level3: z.string().min(1, "소분류를 선택해주세요"),
  sleeveType: SleeveTypeSchema.optional(),
  necklineType: NecklineTypeSchema.optional(),
  name: z.string().min(1, "규칙 이름을 입력해주세요"),
  items: z.array(z.string()).min(1, "최소 1개 이상의 치수 항목을 선택해주세요"),
});

export type MeasurementRuleFormData = z.infer<typeof measurementRuleSchema>;

export function MeasurementRuleForm() {
  const form = useForm<z.infer<typeof measurementRuleSchema>>({
    resolver: zodResolver(measurementRuleSchema),
    defaultValues: {
      name: "",
      items: [],
      level1: categories[0]?.id || "",
      level2: categories[0]?.children?.[0]?.id || "",
    },
    mode: "onSubmit",
    shouldFocusError: true,
  });

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
                  선택된 항목:{" "}
                  <strong>{form.watch("items")?.length || 0}</strong>개
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
          <SaveButtons />
        </div>
      </form>
      <QueryDevTools control={form.control} />
    </Form>
  );
}

function SaveButtons() {
  const form = useFormContext<MeasurementRuleFormData>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleSubmit = async (data: MeasurementRuleFormData) => {
    form.trigger();

    if (data.level2 === "상의" && (!data.sleeveType || !data.necklineType)) {
      toast({
        title: "소매 유형, 넥라인 유형을 선택해주세요.",
      });
      return;
    }

    try {
      const res = await createMeasurementRule({
        category_large: data.level1,
        category_medium: data.level2,
        category_small: data.level3,
        sleeve_type: data.sleeveType ?? "NONE",
        neck_line_type: data.necklineType ?? "NONE",
        rule_name: data.name,
        measurement_codes: data.items,
      });
      toast({
        title: "치수 규칙 생성 완료",
        description: `"${data.name}" 치수 규칙이 성공적으로 저장되었습니다.`,
      });

      queryClient.invalidateQueries();

      return res.data.id;
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

  const handleSave = async () => {
    await handleSubmit(form.getValues());
    router.push(`/measurement-rules`);
    router.refresh();
  };

  const handleSaveAndCreateTemplate = async () => {
    const id = await handleSubmit(form.getValues());
    if (id) {
      router.push(`/templates/new?ruleId=${encodeURIComponent(id)}`);
    }
  };

  return (
    <>
      <Button type="button" onClick={handleSave}>
        저장
      </Button>
      <Button
        type="button"
        variant="default"
        onClick={handleSaveAndCreateTemplate}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        저장 후 템플릿 생성
      </Button>
    </>
  );
}
