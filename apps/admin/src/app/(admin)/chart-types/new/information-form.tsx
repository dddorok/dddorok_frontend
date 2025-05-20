import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense, useCallback, useEffect } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  BODY_DETAIL_TYPE,
  SectionType,
  RETAIL_DETAIL_TYPE,
  ChartSectionSchema,
} from "./constants";

import {
  CommonCheckboxListField,
  CommonInputField,
  CommonSelectField,
} from "@/components/CommonFormField";
import { CommonRadioGroup } from "@/components/CommonUI";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { getMeasurementRuleList } from "@/services/measurement-rule";

const baseFormSchema = z.object({
  section: ChartSectionSchema,
  measurementRuleId: z.string().optional(),
  measurement_code_maps: z
    .array(
      z.object({
        measurement_code: z.string(),
        path_id: z.string(),
      })
    )
    .optional(),
  chartName: z.string().min(1, "차트 이름을 입력해주세요"),
  detailType: z.string(),
});

const bodyFormSchema = baseFormSchema.extend({
  section: z.literal("BODY"),
  measurementRuleName: z.string().optional(),
});

const retailFormSchema = baseFormSchema.extend({
  section: z.literal("SLEEVE"),
  selectedMeasurements: z
    .array(z.string())
    .min(1, "최소 1개 이상의 측정항목을 선택해주세요"),
});

const formSchema = z.discriminatedUnion("section", [
  bodyFormSchema,
  retailFormSchema,
]);

type FormValues = z.infer<typeof formSchema>;

export default function InformationForm({
  onSubmit,
}: {
  onSubmit: (data: FormValues) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { section: "BODY" } as any,
  });

  const handleProductTypeChange = useCallback(
    (type: SectionType) => {
      const currentChartName = form.getValues("chartName");

      if (type === "BODY") {
        form.reset({
          section: "BODY",
          chartName: currentChartName,
          detailType: "",
          measurementRuleId: "",
        });
      } else {
        form.reset({
          section: "SLEEVE",
          chartName: currentChartName,
          detailType: "",
          selectedMeasurements: [],
        });
      }
    },
    [form]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full  mx-auto p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold">Step 1. 기본 정보 입력</h2>
        <div className="space-y-2">
          <div className="flex space-x-2 mb-6 flex-col gap-2">
            <p className="text-lg">제품군별 선택</p>
            <div className="flex space-x-4 ml-0">
              <CommonRadioGroup
                options={[
                  { label: "몸판", value: "BODY" },
                  { label: "소매", value: "SLEEVE" },
                ]}
                onChange={(value) =>
                  handleProductTypeChange(value as SectionType)
                }
                defaultValue="BODY"
                className="w-full flex gap-2"
              />
            </div>
          </div>
        </div>

        <Tabs value={form.watch("section")} className="w-full">
          <TabsContent value="BODY" className="space-y-6">
            <Suspense fallback={<div>Loading...</div>}>
              <BodyChart />
            </Suspense>
          </TabsContent>

          <TabsContent value="SLEEVE" className="space-y-6">
            <RetailChart />
          </TabsContent>
        </Tabs>

        <ChartNameForm />

        <div className="flex justify-end mt-8">
          <Button type="submit" variant="outline" className="px-8">
            다음
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ChartNameForm() {
  const form = useFormContext<FormValues>();
  const section = useWatch({ name: "section" });
  const detailType = useWatch({ name: "detailType" });
  const measurementRuleName = useWatch({ name: "measurementRuleName" });

  useEffect(() => {
    if (section === "BODY" && detailType) {
      // {치수규칙명} {세부유형} 형식으로 자동 생성
      // ex) 래글런형 브이넥 스웨터 상단 전개도
      form.setValue(
        "chartName",
        `${measurementRuleName} ${detailType} 상단 전개도`
      );
    }
    if (section === "SLEEVE" && detailType) {
      // {세부유형} 소매 형식으로 자동 생성
      // ex)셋인형 소매
      form.setValue("chartName", `${detailType} 소매`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailType, section, measurementRuleName]);

  return (
    <CommonInputField
      name="chartName"
      label="차트이름"
      placeholder="자동생성, 수정가능"
    />
  );
}

function BodyChart() {
  const form = useFormContext<FormValues>();
  const { data: measurementRuleList } = useSuspenseQuery({
    queryKey: ["measurementRuleList"],
    queryFn: () => getMeasurementRuleList(),
  });

  return (
    <div className="space-y-4">
      <CommonSelectField
        name="detailType"
        label="몸판 세부유형 선택"
        placeholder="선택하세요"
        options={BODY_DETAIL_TYPE.map((type) => ({
          label: type,
          value: type,
        }))}
      />
      <CommonSelectField
        name="measurementRuleId"
        label="치수규칙 선택"
        options={measurementRuleList.data.map((item) => ({
          label: item.rule_name,
          value: item.id,
        }))}
        onChange={(value) => {
          const selectedRule = measurementRuleList.data.find(
            (item) => item.id === value
          );
          form.setValue("measurementRuleName", selectedRule?.rule_name);
        }}
        placeholder="선택하세요"
      />
    </div>
  );
}

function RetailChart() {
  const form = useFormContext<FormValues>();

  const { data: measurementRuleItemCodeList } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleItemCodeQueryOptions(),
  });

  const sleeveOptions =
    measurementRuleItemCodeList
      ?.filter((item) => item.section === "소매")
      .map((item) => ({
        label: item.label,
        value: item.code,
      })) ?? [];

  return (
    <div className="space-y-4">
      <CommonSelectField
        name="detailType"
        label="소매 서브유형 선택"
        options={RETAIL_DETAIL_TYPE.map((type) => ({
          label: type,
          value: type,
        }))}
        placeholder="선택하세요"
      />

      <CommonCheckboxListField
        name="selectedMeasurements"
        label="측정항목 선택"
        options={sleeveOptions}
      />
    </div>
  );
}
