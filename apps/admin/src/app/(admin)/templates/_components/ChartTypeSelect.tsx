"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ChartTypeOrderDialog } from "./ChartTypeOrderDialog";
import { TemplateFormData } from "./template-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { chartTypeQueries } from "@/queries/chart-type";

type ChartTypeMap = {
  chart_type_id: string;
  order: number;
};

interface ChartTypeSelectProps {
  selectedPatternType: string;
  chartTypeMapsName: string;
}

export function ChartTypeSelect({
  selectedPatternType,
  chartTypeMapsName,
}: ChartTypeSelectProps) {
  const form = useFormContext();

  const chartTypeMaps: ChartTypeMap[] = useWatch({ name: chartTypeMapsName });

  // TODO: 차트형 또는 혼합형 패턴 -> 차트 유형 활성화
  // TODO: 필드가 비활성화될 때 값 초기화

  const chartBasedPattern =
    selectedPatternType === "GRID" || selectedPatternType === "MIXED";

  const { data: chartTypeList } = useQuery(chartTypeQueries.list());

  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedChartTypes = (chartTypeMaps || [])
    .map((map) => ({
      ...chartTypeList?.find((ct) => ct.id === map.chart_type_id),
      chart_type_id: map.chart_type_id,
      order: map.order,
      name:
        chartTypeList?.find((ct) => ct.id === map.chart_type_id)?.name ?? "",
    }))
    .sort((a, b) => a.order - b.order);

  if (!chartBasedPattern) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>차트 유형 선택</CardTitle>
        <CardDescription>차트 유형을 설정해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          name={chartTypeMapsName}
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
                        (map: ChartTypeMap) =>
                          map.chart_type_id === chartType.id
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
                              (map: ChartTypeMap) =>
                                map.chart_type_id !== chartType.id
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
              ...(chartTypeMaps.find(
                (m) => m.chart_type_id === o.chart_type_id
              ) || {}),
              order: o.order,
            }));
            form.setValue(chartTypeMapsName, merged as any);
          }}
        />
      </CardContent>
    </Card>
  );
}
