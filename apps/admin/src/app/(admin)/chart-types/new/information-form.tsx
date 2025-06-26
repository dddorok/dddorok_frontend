import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense, useCallback, useEffect } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  SectionType,
  ChartSectionSchema,
  RETAIL_DETAIL,
  BODY_DETAIL,
  BodyDetailType,
  RetailDetailType,
} from "./constants";

import {
  CommonInputField,
  CommonSelectField,
} from "@/components/CommonFormField";
import { CommonRadioGroup } from "@/components/CommonUI";
import { MeasurementRuleSelectSection } from "@/components/SelectSection/MeasurementRuleSelectSection";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { createChartType, uploadSvg } from "@/services/chart-type";

const baseFormSchema = z.object({
  section: ChartSectionSchema,
  measurementRuleId: z.string().optional(),
  selectedMeasurements: z.array(z.string()).optional(),
  chartName: z.string().min(1, "차트 이름을 입력해주세요"),
  detailType: z.string(),
  svgFile: z.instanceof(File),
});

const bodyFormSchema = baseFormSchema.extend({
  section: z.literal("BODY"),
  ruleType: z.enum(["RULE", "CODE"]),
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
  onSubmit: (id: string, data: FormValues) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { section: "BODY", ruleType: "RULE" } as any,
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

  const handleSubmit = async (values: FormValues) => {
    console.log(values);

    // TODO: 파일 업로드 기능 추가
    const { resource_id } = await uploadSvg(values.svgFile);

    // "https://dddorok-s3.s3.amazonaws.com/public/chart-svg/766d0a72-c662-4fbd-b859-4ca26d12a811.svg"

    // const resourceId = "766d0a72-c662-4fbd-b859-4ca26d12a811";

    const data = await createChartType({
      section: values.section,
      detail_type: values.detailType,
      name: values.chartName,
      resource_id: resource_id,
    });

    onSubmit(data.id, values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-muted-foreground">
                SVG 파일을 업로드 해주세요.
              </Label>
              <p className="text-sm text-muted-foreground">
                SVG에서 path 정보를 자동으로 추출할 수 있습니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".svg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.type !== "image/svg+xml") {
                    form.setError("svgFile", {
                      message: "SVG 파일만 업로드 가능합니다.",
                    });
                    return;
                  }

                  if (file.size > 10 * 1024 * 1024) {
                    form.setError("svgFile", {
                      message: "10MB 이하의 SVG 파일만 업로드할 수 있습니다.",
                    });
                    return;
                  }

                  form.setValue("svgFile", file);
                  form.clearErrors("svgFile");
                }}
              />
            </div>
          </div>
          {form.formState.errors.svgFile && (
            <p className="text-sm text-destructive">
              {form.formState.errors.svgFile.message}
            </p>
          )}
        </div>

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
        `${measurementRuleName} ${BODY_DETAIL[detailType as BodyDetailType].label} 상단 전개도`
      );
    }
    if (section === "SLEEVE" && detailType) {
      // {세부유형} 소매 형식으로 자동 생성
      // ex)셋인형 소매
      form.setValue(
        "chartName",
        `${RETAIL_DETAIL[detailType as RetailDetailType].label} 소매`
      );
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
  return (
    <div className="space-y-4">
      <CommonSelectField
        name="detailType"
        label="몸판 세부유형 선택"
        placeholder="선택하세요"
        options={Object.values(BODY_DETAIL).map((type) => ({
          label: type.label,
          value: type.value,
        }))}
      />
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="ruleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>측정항목 선택 방식</FormLabel>
              <CommonRadioGroup
                options={[
                  { label: "치수규칙 선택", value: "RULE" },
                  { label: "측정항목 직접 선택", value: "CODE" },
                ]}
                onChange={(value) => {
                  form.setValue("ruleType", value as "RULE" | "CODE");
                  form.setValue("measurementRuleId", "");
                  form.setValue("measurementRuleName", "");
                  form.setValue("selectedMeasurements", []);
                }}
                defaultValue="RULE"
                className="w-full flex gap-2"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {form.watch("ruleType") === "RULE" && (
        <MeasurementRuleIdSelectSection key={form.watch("ruleType")} />
      )}

      {form.watch("ruleType") === "CODE" && (
        <MeasurementRuleSelectSection
          selectedItems={form.watch("selectedMeasurements") ?? []}
          onChange={(items) => {
            form.setValue("selectedMeasurements", items);
          }}
          filter={(item) => item.section === "몸통"}
        />
      )}
    </div>
  );
}

function RetailChart() {
  const form = useFormContext<FormValues>();
  return (
    <div className="space-y-4">
      <CommonSelectField
        name="detailType"
        label="소매 세브유형 선택"
        options={Object.values(RETAIL_DETAIL).map((type) => ({
          label: type.label,
          value: type.value,
        }))}
        placeholder="선택하세요"
      />

      <MeasurementRuleSelectSection
        selectedItems={form.watch("selectedMeasurements") ?? []}
        onChange={(items) => {
          form.setValue("selectedMeasurements", items);
        }}
        filter={(item) => item.section === "소매"}
      />
    </div>
  );
}

function MeasurementRuleIdSelectSection() {
  const form = useFormContext<FormValues>();
  const { data: measurementRuleList } = useSuspenseQuery({
    ...measurementRuleQueries.list(),
  });

  return (
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
  );
}
