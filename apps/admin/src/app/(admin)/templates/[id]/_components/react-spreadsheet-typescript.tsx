"use client";

import React, { useState, useCallback } from "react";
import Spreadsheet from "react-spreadsheet";

import { COLUMN_HEADERS, EDITABLE_COLUMNS } from "../constants";
import { useSheetData } from "./useSheetData";

import { Button } from "@/components/ui/button";
import {
  GetTemplateMeasurementValuesItemType,
  TemplateMeasurementValuesItemCore,
} from "@/services/template/measure-value";

// 컬럼 헤더 매핑 타입

// 표시할 컬럼들 순서대로
const displayColumns: (keyof GetTemplateMeasurementValuesItemType)[] = [
  "label",
  ...EDITABLE_COLUMNS,
  "range_toggle",
];

const ExcelTableWithLibrary = ({
  initialData,
  onSubmit,
}: {
  initialData: GetTemplateMeasurementValuesItemType[];
  onSubmit: (data: TemplateMeasurementValuesItemCore[]) => Promise<void>;
}) => {
  const { data, spreadsheetData, handleDataChange, errors, validateData } =
    useSheetData(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 제출 함수
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    try {
      const hasErrors = validateData(); // 검증

      if (hasErrors) {
        alert("숫자가 아닌 값이 있습니다. 확인해주세요.");
        return;
      }

      await onSubmit(data);
    } catch (error) {
      console.error("Submit error:", error);
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  return (
    <div className="max-w-full overflow-x-auto">
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "제출 중..." : "제출"}
        </Button>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Spreadsheet
          data={spreadsheetData}
          onChange={handleDataChange}
          columnLabels={displayColumns.map(
            (col) => COLUMN_HEADERS[col] || String(col)
          )}
          darkMode={false}
        />
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700 font-semibold">
            ⚠️ 오류가 있는 셀들을 확인해주세요 (빨간색 배경)
          </p>
        </div>
      )}
    </div>
  );
};

export default ExcelTableWithLibrary;
