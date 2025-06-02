"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, CheckSquare } from "lucide-react";
import { ComponentProps } from "react";
import { useForm, useFormContext } from "react-hook-form";
import * as z from "zod";

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
import {
  NECKLINE,
  NecklineTypeSchema,
  SLEEVE,
  SleeveTypeSchema,
} from "@/constants/top";
import { QueryDevTools } from "@/lib/react-query";

interface MeasurementRuleFormProps {
  initialValues: MeasurementRuleFormData;
  onSubmit: (data: MeasurementRuleFormData) => Promise<void>;
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

export function MeasurementRuleForm({
  initialValues,
  onSubmit,
}: MeasurementRuleFormProps) {
  const form = useForm<z.infer<typeof measurementRuleSchema>>({
    resolver: zodResolver(measurementRuleSchema),
    defaultValues: initialValues,
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
          <SaveButtons onSubmit={onSubmit} />
        </div>
      </form>
      <QueryDevTools control={form.control} />
    </Form>
  );
}

function MeasurementRuleDefaultSection() {
  const form = useFormContext();

  const formValues = form.getValues();

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
          <FixedField label="대분류" value={formValues.level1} />
          <FixedField label="중분류" value={formValues.level2} />
          <FixedField label="소분류" value={formValues.level3} />
        </div>
      </div>
      {formValues.sleeveType && (
        <FixedField
          label="소매 유형"
          value={SLEEVE[formValues.sleeveType as keyof typeof SLEEVE].label}
        />
      )}
      {formValues.necklineType && (
        <FixedField
          label="넥라인"
          value={
            NECKLINE[formValues.necklineType as keyof typeof NECKLINE].label
          }
        />
      )}
      <FixedField label="규칙 이름" value={formValues.name} />
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

    try {
      await onSubmit(requestData);
    } catch (error) {}
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

function FormSelect({
  options,
  label,
  placeholder,
  onChange,
  disabled,
  ...props
}: {
  options: { id: string; name: string }[];
  label?: string;
  placeholder?: string;
  name: ComponentProps<typeof FormField>["name"];
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value);
                field.onBlur();
              }}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
