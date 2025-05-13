"use client";

import { Info, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SIZE_RANGE_KEYS,
  SIZE_RANGE_LABEL,
  SizeRangeType,
} from "@/constants/size-range";
import {
  GetTemplateMeasurementValuesItemType,
  GetTemplateMeasurementValuesResponse,
  TemplateMeasurementValueType,
} from "@/services/template/measure-value";

type SizeDetailFormType = Record<SizeRangeType, Record<string, string>>;

interface SizeDetailFormProps {
  onSubmit: (result: TemplateMeasurementValueType[]) => void;
  measurementValues: GetTemplateMeasurementValuesResponse;
}

export function SizeDetailForm({
  onSubmit,
  measurementValues,
}: SizeDetailFormProps) {
  const router = useRouter();

  const {
    sizeDetails,
    handlePaste,
    handleCellChange,
    tableRef,
    selectedItems,
  } = useSizeDetails(measurementValues);

  const handleSubmit = () => {
    const result = convertToTemplateMeasurementValueType(sizeDetails);
    try {
      onSubmit(result);
    } catch (error) {
      console.error("Error submitting size details: ", error);
    }
  };

  // 측정 항목 ID로부터 한글 이름 가져오기
  const getItemName = (itemId: string) => {
    return measurementValues.find((item) => item.id === itemId)?.label;
  };

  // 측정 규칙이 있지만 선택된 항목이 없는 경우 확인
  if (selectedItems.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>알림</AlertTitle>
        <AlertDescription>
          측정 규칙에 선택된 항목이 없습니다. 먼저 측정 규칙 설정에서 항목을
          추가해주세요.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>템플릿 세부 치수 입력</CardTitle>
          <CardDescription>
            각 사이즈별 세부 치수를 입력해주세요. 엑셀에서 복사한 데이터를
            붙여넣기하여 여러 셀을 한번에 입력할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <strong>min</strong>과 <strong>max</strong>는 사용자가 프로젝트
                생성 시 세부 치수를 조정할 수 있는 범위입니다. 보통 1~5cm 내외로
                설정합니다.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <FileText className="h-4 w-4" />
                <span>엑셀에서 복사한 데이터를 붙여넣기할 수 있습니다.</span>
              </div>
            </div>
            <Table className="border" ref={tableRef} onPaste={handlePaste}>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[150px] font-bold border">
                    측정 항목
                  </TableHead>
                  {SIZE_RANGE_KEYS.map((size) => (
                    <TableHead
                      key={size}
                      className="text-center font-bold border whitespace-nowrap"
                    >
                      {SIZE_RANGE_LABEL[size]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((itemId) => (
                  <TableRow key={itemId} className="border">
                    <TableCell className="font-medium border whitespace-nowrap">
                      {getItemName(itemId)}
                    </TableCell>
                    {SIZE_RANGE_KEYS.map((size) => (
                      <TableCell
                        key={`${itemId}-${size}`}
                        className={`p-0 border ${size === "min" || size === "max" ? "bg-blue-50" : ""}`}
                        contentEditable
                        onBlur={(e) =>
                          handleCellChange(
                            size as SizeRangeType,
                            itemId,
                            e.currentTarget.textContent || ""
                          )
                        }
                        suppressContentEditableWarning
                      >
                        {sizeDetails[size]?.[itemId] || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          취소
        </Button>
        <Button type="button" onClick={handleSubmit}>
          저장
        </Button>
      </div>
    </div>
  );
}

const useSizeDetails = (
  measurementValues: GetTemplateMeasurementValuesResponse
) => {
  const selectedItems = measurementValues.map((item) => item.id);
  const [sizeDetails, setSizeDetails] = useState<SizeDetailFormType>(
    convertToSizeRangeTypeRecord(measurementValues)
  );
  const tableRef = useRef<HTMLTableElement>(null);

  // 붙여넣기 이벤트 처리
  const handlePaste = (e: React.ClipboardEvent<HTMLTableElement>) => {
    e.preventDefault();

    const clipboardData = e.clipboardData;
    const pastedData = clipboardData.getData("text");
    const rows = pastedData.split("\n").filter((row) => row.trim());

    // 이벤트가 발생한 셀 위치 찾기
    const activeElement = document.activeElement;
    if (
      !activeElement ||
      !(
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTableCellElement
      )
    ) {
      return;
    }

    let targetCell = activeElement;
    if (activeElement instanceof HTMLInputElement) {
      targetCell = activeElement.closest("td") as HTMLTableCellElement;
    }

    if (!targetCell) return;

    // 행과 열 인덱스 찾기
    const rowIndex = Array.from(
      targetCell.parentElement?.parentElement?.children || []
    ).indexOf(targetCell.parentElement as HTMLTableRowElement);
    const colIndex = Array.from(
      targetCell.parentElement?.children || []
    ).indexOf(targetCell);

    if (rowIndex === -1 || colIndex === -1) return;

    // 새 데이터로 상태 업데이트
    const newSizeDetails = { ...sizeDetails };
    const tableRows = Array.from(
      tableRef.current?.querySelectorAll("tbody tr") || []
    );
    const headerCells = Array.from(
      tableRef.current?.querySelectorAll("thead th") || []
    );

    rows.forEach((rowData, rowOffset) => {
      const columns = rowData.split("\t");
      columns.forEach((cellData, colOffset) => {
        const targetRowIndex = rowIndex + rowOffset;
        const targetColIndex = colIndex + colOffset;

        if (
          targetRowIndex < tableRows.length &&
          targetColIndex > 0 &&
          targetColIndex < headerCells.length
        ) {
          const itemId = selectedItems?.[targetRowIndex];
          const sizeRange = headerCells[targetColIndex]
            ?.textContent as SizeRangeType;

          if (itemId && sizeRange && newSizeDetails[sizeRange]) {
            newSizeDetails[sizeRange][itemId] = cellData.trim();
          }
        }
      });
    });

    setSizeDetails(newSizeDetails);
  };

  // 셀 값 변경 처리
  const handleCellChange = (
    sizeRange: SizeRangeType,
    itemId: string,
    value: string
  ) => {
    setSizeDetails((prev) => ({
      ...prev,
      [sizeRange]: { ...prev[sizeRange], [itemId]: value },
    }));
  };

  return {
    sizeDetails,
    handlePaste,
    handleCellChange,
    tableRef,
    selectedItems,
  };
};

function convertToTemplateMeasurementValueType(
  input: SizeDetailFormType
): TemplateMeasurementValueType[] {
  // 모든 id(측정항목) 추출
  const allIds = new Set<string>();
  Object.values(input).forEach((measurements) => {
    Object.keys(measurements).forEach((id) => allIds.add(id));
  });

  // id별로 객체 생성
  const result: TemplateMeasurementValueType[] = [];
  allIds.forEach((id) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = { id };
    SIZE_RANGE_KEYS.forEach((range) => {
      const value = input[range]?.[id];
      obj[range] = value ? Number(value) : undefined;
    });
    result.push(obj);
  });

  return result;
}

function convertToSizeRangeTypeRecord(
  arr: GetTemplateMeasurementValuesItemType[]
): SizeDetailFormType {
  const result = {} as SizeDetailFormType;

  SIZE_RANGE_KEYS.forEach((range) => {
    result[range] = {};
  });

  arr.forEach((item) => {
    SIZE_RANGE_KEYS.forEach((range) => {
      const key = item.id;
      const value = item[range as keyof GetTemplateMeasurementValuesItemType];
      result[range][key] = value === null ? "" : String(value);
    });
  });

  return result;
}
