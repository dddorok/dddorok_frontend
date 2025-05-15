import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  BODY_DETAIL_TYPE,
  GROUPPING_MEASUREMENT,
  MEASUREMENT,
  RETAIL_DETAIL_TYPE,
} from "./constants";

import { CommonSelect } from "@/components/CommonUI";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getMeasurementRuleList } from "@/services/measurement-rule";

// 몸판 폼 스키마
const bodyFormSchema = z.object({
  type: z.literal("몸판"),
  bodyDetailType: z.string({
    required_error: "몸판 세부유형을 선택해주세요",
  }),
  measurementRule: z.string({
    required_error: "치수규칙을 선택해주세요",
  }),
  measurementRuleName: z.string().optional(),
  chartName: z.string().min(1, "차트 이름을 입력해주세요"),
});

// 소매 폼 스키마
const retailFormSchema = z.object({
  type: z.literal("소매"),
  retailDetailType: z.string({
    required_error: "소매 서브유형을 선택해주세요",
  }),
  selectedMeasurements: z
    .array(z.string())
    .min(1, "최소 1개 이상의 측정항목을 선택해주세요"),
  chartName: z.string().min(1, "차트 이름을 입력해주세요"),
});

// 통합 폼 스키마
const formSchema = z.discriminatedUnion("type", [
  bodyFormSchema,
  retailFormSchema,
]);

type BodyFormValues = z.infer<typeof bodyFormSchema>;
type RetailFormValues = z.infer<typeof retailFormSchema>;
type FormValues = z.infer<typeof formSchema>;

export default function InformationForm() {
  const [selectedTab, setSelectedTab] = useState<"몸판" | "소매">("몸판");
  const [activeTab, setActiveTab] = useState("case1");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "몸판",
      chartName: "",
      ...(selectedTab === "몸판"
        ? {
            bodyDetailType: "",
            measurementRule: "",
          }
        : {
            retailDetailType: "",
            selectedMeasurements: [],
          }),
    },
  });

  const handleProductTypeChange = useCallback(
    (type: "몸판" | "소매") => {
      setSelectedTab(type);
      setActiveTab(type === "몸판" ? "case1" : "case2");

      const currentChartName = form.getValues("chartName");

      if (type === "몸판") {
        form.reset({
          type: "몸판",
          chartName: currentChartName,
          bodyDetailType: "",
          measurementRule: "",
        } as BodyFormValues);
      } else {
        form.reset({
          type: "소매",
          chartName: currentChartName,
          retailDetailType: "",
          selectedMeasurements: [],
        } as RetailFormValues);
      }
    },
    [form]
  );

  const onSubmit = useCallback((data: FormValues) => {
    console.log(data);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-3xl mx-auto p-6 space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Step 1. 자동운영 선택</h2>

          <div className="flex items-center space-x-2 mb-6">
            <p className="text-lg">제품군별 선택</p>
            <div className="flex ml-8 space-x-4">
              <RadioGroup defaultValue="comfortable">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">Comfortable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="r3" />
                  <Label htmlFor="r3">Compact</Label>
                </div>
              </RadioGroup>

              {/* <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => handleProductTypeChange("몸판")}
              >
                <div
                  className={`w-5 h-5 rounded-full ${selectedTab === "몸판" ? "bg-black" : "border border-gray-300"} flex items-center justify-center text-white text-xs`}
                >
                  ○
                </div>
                <span>몸판</span>
              </div>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => handleProductTypeChange("소매")}
              >
                <div
                  className={`w-5 h-5 rounded-full ${selectedTab === "소매" ? "bg-black" : "border border-gray-300"} flex items-center justify-center text-white text-xs`}
                >
                  ○
                </div>
                <span>소매</span>
              </div> */}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="case1">몸판 선택 시</TabsTrigger>
            <TabsTrigger value="case2">소매 선택 시</TabsTrigger>
          </TabsList>

          <TabsContent value="case1" className="space-y-6">
            <h3 className="text-lg font-medium">Case 1. 몸판 선택 시</h3>
            <Suspense fallback={<div>Loading...</div>}>
              <BodyChart />
            </Suspense>
          </TabsContent>

          <TabsContent value="case2" className="space-y-6">
            <h3 className="text-lg font-medium">Case 2. 소매 선택 시</h3>
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
  const type = useWatch({ name: "type" });
  const bodyDetailType = useWatch({ name: "bodyDetailType" });
  const measurementRuleName = useWatch({ name: "measurementRuleName" });
  const retailDetailType = useWatch({ name: "retailDetailType" });

  useEffect(() => {
    if (type === "몸판" && bodyDetailType) {
      // {치수규칙명} {세부유형} 형식으로 자동 생성
      // ex) 래글런형 브이넥 스웨터 상단 전개도
      form.setValue(
        "chartName",
        `${measurementRuleName} ${bodyDetailType} 상단 전개도`
      );
    }
    if (type === "소매" && retailDetailType) {
      // {세부유형} 소매 형식으로 자동 생성
      // ex)셋인형 소매
      form.setValue("chartName", `${retailDetailType} 소매`);
    }
  }, [bodyDetailType, retailDetailType, type, measurementRuleName]);

  return (
    <FormField
      name="chartName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>차트이름</FormLabel>
          <FormControl>
            <Input {...field} placeholder="자동생성, 수정가능" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
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
      <FormField
        control={form.control}
        name="bodyDetailType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>몸판 세부유형 선택</FormLabel>
            <FormControl>
              <CommonSelect
                options={BODY_DETAIL_TYPE.map((type) => ({
                  label: type,
                  value: type,
                }))}
                onChange={field.onChange}
                placeholder="선택하세요"
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="measurementRule"
        render={({ field }) => (
          <FormItem>
            <FormLabel>치수규칙 선택</FormLabel>
            <FormControl>
              <CommonSelect
                options={measurementRuleList.data.map((item) => ({
                  label: item.rule_name,
                  value: item.id,
                }))}
                onChange={(value) => {
                  const selectedRule = measurementRuleList.data.find(
                    (item) => item.id === value
                  );
                  form.setValue("measurementRuleName", selectedRule?.rule_name);
                  field.onChange(value);
                }}
                placeholder="선택하세요"
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function RetailChart() {
  const form = useFormContext<FormValues>();

  const sleeveOptions =
    GROUPPING_MEASUREMENT["소매"]?.map((item) => ({
      label: MEASUREMENT[item as keyof typeof MEASUREMENT]?.측정_항목 ?? "",
      value: item,
    })) ?? [];

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="retailDetailType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>소매 서브유형 선택</FormLabel>
            <FormControl>
              <CommonSelect
                options={RETAIL_DETAIL_TYPE.map((type) => ({
                  label: type,
                  value: type,
                }))}
                onChange={field.onChange}
                placeholder="선택하세요"
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="selectedMeasurements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>측정항목 선택</FormLabel>
            <div className="grid grid-cols-2 gap-4">
              {sleeveOptions.map(({ label, value }) => (
                <div className="flex items-center space-x-2" key={value}>
                  <Checkbox
                    id={value}
                    checked={field.value?.includes(value)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, value]);
                      } else {
                        field.onChange(currentValue.filter((v) => v !== value));
                      }
                    }}
                  />
                  <Label htmlFor={value} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
