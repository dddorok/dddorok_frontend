import { data } from "motion/react-client";
import { useCallback, ChangeEvent } from "react";

import { EDITABLE_COLUMNS, getDefaultRow } from "../constants";
import { parseToNumber } from "../utils";

import { GetTemplateMeasurementValuesItemType } from "@/services/template/measure-value";

export default function ExcelFileUpload({
  data,
  setData,
}: {
  data: GetTemplateMeasurementValuesItemType[];
  setData: (data: GetTemplateMeasurementValuesItemType[]) => void;
}) {
  const handleFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) return;

          // 간단한 CSV 파싱 (실제로는 SheetJS 사용 권장)
          const rows = text.split("\n").map((row) => row.split(","));

          // 첫 번째 행은 헤더로 가정
          const [headers, ...dataRows] = rows;
          // 기존 데이터 구조에 맞게 변환
          const newData: GetTemplateMeasurementValuesItemType[] = dataRows
            .filter((row) => row.length > 0 && row[0]?.trim()) // 빈 행 제거
            .map((row, index) => {
              const defaultRow = getDefaultRow(`new-${index}`);

              const newRow: GetTemplateMeasurementValuesItemType = {
                ...(data[index] || defaultRow),
              };

              headers?.forEach((header, colIndex) => {
                const cleanHeader = header
                  .trim()
                  .replace(
                    /"/g,
                    ""
                  ) as keyof GetTemplateMeasurementValuesItemType;
                if (EDITABLE_COLUMNS.includes(cleanHeader)) {
                  const value = row[colIndex]?.trim().replace(/"/g, "");
                  (newRow as any)[cleanHeader] = parseToNumber(value);
                }
              });

              return newRow;
            });

          setData(newData);
        } catch (error) {
          console.error("File parsing error:", error);
          alert("파일을 읽는 중 오류가 발생했습니다.");
        }
      };

      reader.readAsText(file);
    },
    [data]
  );

  return (
    <input
      type="file"
      accept=".csv,.xlsx,.xls"
      onChange={handleFileUpload}
      disabled={true}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  );
}
