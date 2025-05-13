"use client";
import { AlertCircle, Badge, Info, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { TemplateList } from "@/app/(admin)/templates/_components/template-list";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NEEDLE_OPTIONS,
  CHART_TYPE_OPTIONS,
  ChartType,
  NeedleType,
} from "@/constants/template";

export default function TemplatesPage() {
  const filter = useFilter();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">템플릿 관리</h2>
      </div>

      <Alert
        variant="default"
        className="bg-blue-50 text-blue-800 border-blue-200"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          새로운 템플릿을 추가하려면 [치수 규칙 설정] 메뉴에서 규칙을 선택한 후
          템플릿을 생성해주세요.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <FilterSelect {...filter} />
        <Button size="lg" asChild>
          <Link href="/templates/new">새 템플릿 추가</Link>
        </Button>
      </div>

      <TemplateList
        filterOptions={{
          needleType: filter.selectedToolType,
          chartType: filter.selectedChartType,
        }}
      />
    </div>
  );
}

const useFilter = () => {
  const [selectedToolType, setSelectedToolType] = useState<NeedleType | null>(
    null
  );
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(
    null
  );

  const handleToolTypeChange = (value: string) => {
    setSelectedToolType(value as NeedleType);
  };

  const handleChartTypeChange = (value: string) => {
    setSelectedChartType(value as ChartType);
  };

  const clearAllFilters = () => {
    setSelectedToolType(null);
    setSelectedChartType(null);
  };

  return {
    selectedToolType,
    selectedChartType,
    handleToolTypeChange,
    handleChartTypeChange,
    clearAllFilters,
  };
};

function FilterSelect({
  selectedToolType,
  selectedChartType,
  handleToolTypeChange,
  handleChartTypeChange,
  clearAllFilters,
}: ReturnType<typeof useFilter>) {
  return (
    <div className="flex gap-4 items-center mr-4">
      <Select
        value={selectedToolType || ""}
        onValueChange={handleToolTypeChange}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="도구 유형" />
        </SelectTrigger>
        <SelectContent>
          {NEEDLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedChartType || ""}
        onValueChange={handleChartTypeChange}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="도안 유형" />
        </SelectTrigger>
        <SelectContent>
          {CHART_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(selectedToolType || selectedChartType) && (
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          전체 해제
        </Button>
      )}
    </div>
  );
}
