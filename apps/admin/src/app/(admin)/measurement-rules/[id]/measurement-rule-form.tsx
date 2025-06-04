"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, CheckSquare } from "lucide-react";
import { ComponentProps } from "react";
import { useForm, useFormContext } from "react-hook-form";
import * as z from "zod";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NECKLINE, SLEEVE } from "@/constants/top";
import { QueryDevTools } from "@/lib/react-query";
import { GetMeasurementRuleByIdResponse } from "@/services/measurement-rule";

interface MeasurementRuleFormProps {
  initialValues: GetMeasurementRuleByIdResponse;
  onSubmit: (data: MeasurementRuleFormData) => Promise<void>;
}

const measurementRuleSchema = z.object({
  items: z.array(z.string()).min(1, "최소 1개 이상의 치수 항목을 선택해주세요"),
});

export type MeasurementRuleFormData = z.infer<typeof measurementRuleSchema>;

export function MeasurementRuleForm({
  initialValues,
  onSubmit,
}: MeasurementRuleFormProps) {
  const form = useForm<z.infer<typeof measurementRuleSchema>>({
    resolver: zodResolver(measurementRuleSchema),
    defaultValues: {
      items: initialValues.items.map((item) => item.id),
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
            <MeasurementRuleDefaultSection {...initialValues} />
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
          <SaveButtons onSubmit={onSubmit} />
        </div>
      </form>
      <QueryDevTools control={form.control} />
    </Form>
  );
}

function MeasurementRuleDefaultSection(props: GetMeasurementRuleByIdResponse) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <FormLabel>카테고리 선택</FormLabel>
          <FormDescription>
            대분류, 중분류, 소분류를 순서대로 선택해주세요.
          </FormDescription>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FixedField label="대분류" value={props.category_large} />
          <FixedField label="중분류" value={props.category_medium} />
          <FixedField label="소분류" value={props.category_small} />
        </div>
      </div>
      {props.sleeve_type && (
        <FixedField
          label="소매 유형"
          value={SLEEVE[props.sleeve_type as keyof typeof SLEEVE].label}
        />
      )}
      {props.neck_line_type && (
        <FixedField
          label="넥라인"
          value={NECKLINE[props.neck_line_type as keyof typeof NECKLINE].label}
        />
      )}
      <FixedField label="규칙 이름" value={props.rule_name} />
    </div>
  );
}

function FixedField(props: { label: string; value: string }) {
  return (
    <div>
      <FormLabel>{props.label}</FormLabel>
      <p className="p-3 bg-gray-50 rounded-md border text-sm mt-1">
        {props.value}
      </p>
    </div>
  );
}

function SaveButtons({
  onSubmit,
}: {
  onSubmit: (data: MeasurementRuleFormData) => Promise<void>;
}) {
  const form = useFormContext<MeasurementRuleFormData>();

  const handleSubmit = async (data: MeasurementRuleFormData) => {
    const requestData = {
      ...data,
    };

    await onSubmit(requestData);
  };

  return (
    <Button
      type="button"
      onClick={() => {
        form.trigger();
        form.handleSubmit((data) => handleSubmit(data))();
      }}
    >
      저장
    </Button>
  );
}
