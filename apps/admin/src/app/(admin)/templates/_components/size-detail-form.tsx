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
import { Switch } from "@/components/ui/switch";
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
import { toast } from "@/hooks/use-toast";
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
    setRangeToggleList,
    rangeToggleList,
  } = useSizeDetails(measurementValues);

  const handleSubmit = async () => {
    try {
      const result = convertToTemplateMeasurementValueType(
        sizeDetails,
        rangeToggleList
      );

      const finalResult = await Promise.all(
        result.map(async (item) => {
          const isRangeToggle = rangeToggleList.includes(item.id);

          // - 숫자만 입력 가능, 0 이하의 숫자 입력 방지
          await Promise.all(
            Object.keys(item).map(async (key) => {
              if (
                key !== "id" &&
                key !== "range_toggle" &&
                key !== "min" &&
                key !== "max"
              ) {
                if (typeof item[key as keyof typeof item] === "undefined")
                  return;
                const value = Number(item[key as keyof typeof item]);
                if (isNaN(value)) {
                  throw new Error("숫자만 입력 가능합니다.");
                }
                if (value < 0) {
                  throw new Error("0 이하의 숫자는 입력할 수 없습니다.");
                }
              }
            })
          );

          // - 조정 on 행의 치수값: 0.5 단위로 반올림 (소숫점 첫째 자리)
          // - 조정 off 된 행의 치수값: 0.01 단위로 반올림 (소숫점 둘째 자리)
          const roundedItem = { ...item };
          Object.keys(item).forEach((key) => {
            if (
              key !== "id" &&
              key !== "range_toggle" &&
              key !== "min" &&
              key !== "max"
            ) {
              const value = Number(item[key as keyof typeof item]);
              if (!isNaN(value)) {
                if (isRangeToggle) {
                  // 0.5 단위, 소수점 첫째 자리
                  roundedItem[key as (typeof SIZE_RANGE_KEYS)[number]] =
                    Math.round(value * 2) / 2;
                } else {
                  // 0.01 단위, 소수점 둘째 자리
                  roundedItem[key as (typeof SIZE_RANGE_KEYS)[number]] =
                    Math.round(value * 100) / 100;
                }
              }
            }
          });

          if (isRangeToggle) {
            return {
              ...roundedItem,
              min: item.min ? Number(item.min) : undefined,
              max: item.max ? Number(item.max) : undefined,
            };
          }
          return roundedItem;
        })
      );

      onSubmit(finalResult);
    } catch (error) {
      toast({
        title: "오류",
        description: "치수값 입력 중 오류가 발생했습니다.",
      });
      throw error;
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
                    <TableCell className="border">
                      <Switch
                        checked={rangeToggleList.includes(itemId)}
                        onCheckedChange={(checked) =>
                          setRangeToggleList((prev) =>
                            checked
                              ? [...prev, itemId]
                              : prev.filter((item) => item !== itemId)
                          )
                        }
                      />
                    </TableCell>
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
  const selectedItems = measurementValues.map((item) => item.id).sort();
  const [sizeDetails, setSizeDetails] = useState<SizeDetailFormType>(
    convertToSizeRangeTypeRecord(measurementValues)
  );
  const [rangeToggleList, setRangeToggleList] = useState<string[]>(
    measurementValues.filter((item) => item.range_toggle).map((item) => item.id)
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
    setRangeToggleList,
    selectedItems,
    rangeToggleList,
  };
};

function convertToTemplateMeasurementValueType(
  input: SizeDetailFormType,
  rangeToggleList: string[]
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
    obj.range_toggle = rangeToggleList.includes(id);
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
