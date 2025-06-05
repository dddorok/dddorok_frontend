import { useDebounce } from "@toss/react";
import { useCallback, useMemo, useState, useRef } from "react";
import { CellBase } from "react-spreadsheet";

import { COLUMN_HEADERS, EDITABLE_COLUMNS } from "../constants";
import { validateNumber } from "../utils";

import { toast } from "@/hooks/use-toast";
import { GetTemplateMeasurementValuesItemType } from "@/services/template/measure-value";

// 표시할 컬럼들 순서대로
const displayColumns: (keyof GetTemplateMeasurementValuesItemType)[] = [
  "label",
  ...EDITABLE_COLUMNS,
  "range_toggle",
];

interface ErrorState {
  [key: string]: boolean;
}

// 스프레드시트 셀 타입 확장
interface CustomCell extends CellBase {
  value: string | number;
  readOnly?: boolean;
  className?: string;
}

// useSheetData 훅의 반환 타입 정의
interface UseSheetDataReturn {
  // getCurrentData: () => GetTemplateMeasurementValuesItemType[];
  spreadsheetData: CustomCell[][];
  handleDataChange: (newData: (CellBase | undefined)[][]) => void;
  errors: ErrorState;
  // validateData: () => boolean;
  handleSubmit: (
    callback: (data: GetTemplateMeasurementValuesItemType[]) => Promise<void>
  ) => Promise<void>;
}

export const useSheetData = (
  initialData: GetTemplateMeasurementValuesItemType[]
): UseSheetDataReturn => {
  const dataRef = useRef<GetTemplateMeasurementValuesItemType[]>(initialData);

  const [errors, setErrors] = useState<ErrorState>({});

  const spreadsheetData: CustomCell[][] = useMemo(() => {
    const currentData = dataRef.current;

    const headerRow: CustomCell[] = displayColumns.map((col) => ({
      value: COLUMN_HEADERS[col] || String(col),
      readOnly: true,
    }));

    const dataRows: CustomCell[][] = currentData.map((row, rowIndex) =>
      displayColumns.map((col, colIndex) => {
        const isEditable = EDITABLE_COLUMNS.includes(col);
        const isToggle = col === "range_toggle";

        return {
          value: isToggle ? (row[col] ? "ON" : "OFF") : (row[col] ?? ""),
          readOnly: !isEditable && !isToggle,
          className: errors[`${rowIndex}-${colIndex}`]
            ? "bg-[#ffebee] border border-red-300"
            : "",
        };
      })
    );

    return [headerRow, ...dataRows];
  }, [errors]);

  const handleDataChange = useCallback(
    (newData: (CellBase | undefined)[][]) => {
      const [, ...dataRows] = newData; // 헤더 제거
      const currentData = dataRef.current;

      const newErrors: ErrorState = {};

      for (let rowIndex = 0; rowIndex < currentData.length; rowIndex++) {
        const originalRow = currentData[rowIndex];
        if (!originalRow) continue;

        for (let colIndex = 0; colIndex < displayColumns.length; colIndex++) {
          const col = displayColumns[colIndex];
          if (!col) continue;

          const cellValue = dataRows[rowIndex]?.[colIndex]?.value;

          if (EDITABLE_COLUMNS.includes(col)) {
            if (!validateNumber(cellValue)) {
              newErrors[`${rowIndex}-${colIndex}`] = true;
            }
            // const newValue = parseToNumber(cellValue);
            (originalRow as any)[col] = cellValue;
          } else if (col === "range_toggle") {
            const newValue = String(cellValue) === "ON";
            originalRow[col] = newValue;
          }
        }
      }

      // 에러 상태만 클리어 (필요시에만 리렌더링)
      if (Object.keys(errors).length > 0) {
        setErrors({});
      }

      setErrors(newErrors);
    },
    [errors]
  );

  const debouncedHandleDataChange = useDebounce(handleDataChange, 500);

  const getCurrentData = useCallback(() => {
    return dataRef.current;
  }, []);

  // 제출 시에만 사용하는 전체 검증 함수
  const validateData = useCallback(() => {
    let hasErrors = false;
    const newErrors: { [key: string]: boolean } = {};
    const currentData = dataRef.current;

    currentData.forEach((row, rowIndex) => {
      EDITABLE_COLUMNS.forEach((col) => {
        const value = (row as any)[col];
        if (value !== null && !validateNumber(value)) {
          newErrors[`${rowIndex}-${displayColumns.indexOf(col)}`] = true;
          hasErrors = true;
        }
      });
    });

    console.log("newErrors: ", newErrors);
    setErrors(newErrors);
    return hasErrors;
  }, []);

  const handleSubmit = useCallback(
    async (
      callback: (data: GetTemplateMeasurementValuesItemType[]) => Promise<void>
    ) => {
      try {
        const hasErrors = validateData();

        if (hasErrors) {
          toast({
            title: "숫자가 아닌 값이 있습니다. 확인해주세요.",
            variant: "destructive",
          });
          return;
        }

        const currentData = getCurrentData();

        // 빈 문자열을 null로 변환
        const processedData = currentData.map((row) => {
          const processedRow = { ...row };
          EDITABLE_COLUMNS.forEach((col) => {
            if ((processedRow as any)[col] === "") {
              (processedRow as any)[col] = null;
            }
          });
          return processedRow;
        });

        callback(processedData);
      } catch (error) {
        console.error("Submit error:", error);
      }
    },
    [getCurrentData, validateData]
  );

  return {
    // getCurrentData, // ref 데이터 가져오기
    spreadsheetData,
    handleDataChange: debouncedHandleDataChange,
    errors,
    // validateData,
    handleSubmit,
  };
};
