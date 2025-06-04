import { errors } from "jose";
import { useCallback, useMemo, useState } from "react";
import { CellBase } from "react-spreadsheet";

import { COLUMN_HEADERS, EDITABLE_COLUMNS } from "../constants";
import { parseToNumber, validateNumber } from "../utils";

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

export const useSheetData = (
  initialData: GetTemplateMeasurementValuesItemType[]
) => {
  const [data, setData] =
    useState<GetTemplateMeasurementValuesItemType[]>(initialData);
  const [errors, setErrors] = useState<ErrorState>({});

  // 데이터를 Spreadsheet 형식으로 변환
  const spreadsheetData: CustomCell[][] = useMemo(() => {
    // 헤더 행
    const headerRow: CustomCell[] = displayColumns.map((col) => ({
      value: COLUMN_HEADERS[col] || String(col),
      readOnly: true,
    }));

    // 데이터 행들
    const dataRows: CustomCell[][] = data.map((row, rowIndex) =>
      displayColumns.map((col, colIndex) => {
        const isEditable = EDITABLE_COLUMNS.includes(col);
        const isToggle = col === "range_toggle";

        return {
          value: isToggle ? (row[col] ? "ON" : "OFF") : (row[col] ?? ""),
          readOnly: !isEditable && !isToggle,
          // className: errors[`${rowIndex}-${colIndex}`] ? "error-cell" : "",
          className: errors[`${rowIndex}-${colIndex}`]
            ? "bg-[#ffebee] border border-red-300"
            : "",
        };
      })
    );

    return [headerRow, ...dataRows];
  }, [data, errors]);

  // 데이터 변경 핸들러
  const handleDataChange = useCallback(
    (newData: (CellBase | undefined)[][]) => {
      const [, ...dataRows] = newData; // 헤더 제거

      const updatedData: GetTemplateMeasurementValuesItemType[] = data.map(
        (originalRow, rowIndex) => {
          const newRow: GetTemplateMeasurementValuesItemType = {
            ...originalRow,
          };

          displayColumns.forEach((col, colIndex) => {
            const cellValue = dataRows[rowIndex]?.[colIndex]?.value;

            if (EDITABLE_COLUMNS.includes(col)) {
              // 편집 가능한 숫자 컬럼들
              (newRow as any)[col] = parseToNumber(cellValue);
            } else if (col === "range_toggle") {
              // 토글 컬럼
              newRow[col] = String(cellValue) === "ON";
            }
          });

          return newRow;
        }
      );

      setData(updatedData);

      // 검증 수행
      const newErrors: ErrorState = {};
      updatedData.forEach((row, rowIndex) => {
        EDITABLE_COLUMNS.forEach((col, colIndex) => {
          if (!validateNumber((row as any)[col])) {
            newErrors[`${rowIndex}-${displayColumns.indexOf(col)}`] = true;
          }
        });
      });

      setErrors(newErrors);
    },
    [data]
  );

  const validateData = () => {
    let hasErrors = false;
    const newErrors: { [key: string]: boolean } = {};

    data.forEach((row, rowIndex) => {
      EDITABLE_COLUMNS.forEach((col) => {
        const value = (row as any)[col];
        if (value !== null && !validateNumber(value)) {
          newErrors[`${rowIndex}-${displayColumns.indexOf(col)}`] = true;
          hasErrors = true;
        }
      });
    });

    setErrors(newErrors);

    return hasErrors;
  };

  return { data, spreadsheetData, handleDataChange, errors, validateData };
};
