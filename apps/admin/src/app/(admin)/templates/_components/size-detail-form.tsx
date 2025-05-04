"use client";

import { Info, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
import { SIZE_RANGE_KEYS, SizeRangeType } from "@/constants/size-range";
import { SIZE_RANGES, getMeasurementItemById } from "@/lib/data";
import {
  GetTemplateMeasurementValuesItemType,
  GetTemplateMeasurementValuesResponse,
  TemplateMeasurementValueType,
} from "@/services/template/measure-value";

interface SizeDetailFormProps {
  onSubmit: (result: TemplateMeasurementValueType[]) => void;
  measurementValues: GetTemplateMeasurementValuesResponse;
}

export function SizeDetailForm({
  onSubmit,
  measurementValues,
}: SizeDetailFormProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    measurementValues.map((item) => item.id)
  ); // 항목 ID 배열로 변경
  const [sizeRanges, setSizeRangeTypes] = useState<SizeRangeType[]>([]);

  const {
    sizeDetails,
    handlePaste,
    handleCellChange,
    initializeSizeDetails,
    tableRef,
  } = useSizeDetails();
  // console.log("sizeDetails: ", sizeDetails);
  // Process size details table data when measurement rule is available
  useEffect(() => {
    const measurementList = measurementValues.map((item) => item.id);
    setSelectedItems(measurementList);

    // 언제나 모든 사이즈 범위 사용 (SIZE_RANGES에서 정의된 모든 범위)
    // SIZE_RANGES 배열은 이미 'min'이 처음에, 'max'가 마지막에 정렬되어 있음
    // setSizeRangeTypes(SIZE_RANGES);

    // 기존 사이즈 세부 정보 로드 또는 새 빈 객체 초기화
    initializeSizeDetails(measurementValues);
    // 기존 sizeDetails가 있으면 로드된 빈 구조에 덮어쓰기
    // if (measurementValues && measurementValues.length > 0) {
    //   for (const detail of measurementValues) {
    //     for (const [item, value] of Object.entries(detail.measurements)) {
    //       // 항목 ID를 찾기
    //       const itemId = selectedItems.find((id) => {
    //         const measurementItem = getMeasurementItemById(id);
    //         return measurementItem && measurementItem.name === item;
    //       });

    //       if (itemId) {
    //         details[detail.sizeRange][itemId] = value.toString();
    //       } else {
    //         // 기존 방식으로 처리 (호환성 유지)
    //         const matchingItemId = selectedItems.find((id) => {
    //           return id === item;
    //         });
    //         if (matchingItemId) {
    //           details[detail.sizeRange][matchingItemId] = value.toString();
    //         }
    //       }
    //     }
    //   }
    // }

    // }
  }, []);

  // 셀 값 변경 처리

  // 폼 제출 처리
  const handleSubmit = () => {
    const result = convertToTemplateMeasurementValueType(sizeDetails);
    try {
      onSubmit(result);
    } catch (error) {
      console.error("Error submitting size details: ", error);
    }
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

  // 사이즈 범위가 설정되지 않은 경우 처리
  if (sizeRanges.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>알림</AlertTitle>
        <AlertDescription>사이즈 범위가 설정되지 않았습니다.</AlertDescription>
      </Alert>
    );
  }

  // 표시를 위한 정렬된 사이즈 범위 생성
  const displayOrderedSizeRangeTypes = () => {
    // SIZE_RANGES 배열의 순서를 그대로 사용
    // 이미 data.ts 파일에서 '121-129' 다음에 'min', 그 다음에 'max'가 오도록 정렬되어 있음
    return SIZE_RANGE_KEYS;
  };

  // 측정 항목 ID로부터 한글 이름 가져오기
  const getItemName = (itemId: string) => {
    const item = getMeasurementItemById(itemId);
    return item ? item.name : itemId;
  };

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
                  {displayOrderedSizeRangeTypes().map((size) => (
                    <TableHead
                      key={size}
                      className="text-center font-bold border"
                    >
                      {size}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((itemId) => (
                  <TableRow key={itemId} className="border">
                    <TableCell className="font-medium border">
                      {getItemName(itemId)}
                    </TableCell>
                    {displayOrderedSizeRangeTypes().map((size) => (
                      <TableCell
                        key={`${itemId}-${size}`}
                        className={`p-0 border ${size === "min" || size === "max" ? "bg-blue-50" : ""}`}
                        contentEditable
                        onBlur={(e) =>
                          handleCellChange(
                            size,
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
        <Button variant="outline" type="button">
          취소
        </Button>
        <Button type="button" onClick={handleSubmit}>
          저장
        </Button>
      </div>
    </div>
  );
}

const useSizeDetails = () => {
  const [sizeDetails, setSizeDetails] = useState<
    Record<SizeRangeType, Record<string, string>>
  >({} as Record<SizeRangeType, Record<string, string>>);
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
          const itemId = selectedItems[targetRowIndex];
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
      [sizeRange]: {
        ...prev[sizeRange],
        [itemId]: value,
      },
    }));
  };

  const initializeSizeDetails = (
    measurementValues: GetTemplateMeasurementValuesResponse
  ) => {
    const details = convertToSizeRangeTypeRecord(measurementValues);
    console.log("details: ", details);

    setSizeDetails(details);
  };

  return {
    sizeDetails,
    handlePaste,
    handleCellChange,
    initializeSizeDetails,
    tableRef,
  };
};

const SIZE_RANGE_TO_KEY: Record<SizeRangeType, string> = {
  "50-53": "size_50_53",
  "54-57": "size_54_57",
  "58-61": "size_58_61",
  "62-65": "size_62_65",
  "66-69": "size_66_69",
  "70-73": "size_70_73",
  "74-79": "size_74_79",
  "80-84": "size_80_84",
  "85-89": "size_85_89",
  "90-94": "size_90_94",
  "95-99": "size_95_99",
  "100-104": "size_100_104",
  "105-109": "size_105_109",
  "110-114": "size_110_114",
  "115-120": "size_115_120",
  "121-129": "size_121_129",
  min: "min",
  max: "max",
};

function convertToTemplateMeasurementValueType(
  input: Record<SizeRangeType, Record<string, string>>
): TemplateMeasurementValueType[] {
  // 모든 id(측정항목) 추출
  const allIds = new Set<string>();
  Object.values(input).forEach((measurements) => {
    Object.keys(measurements).forEach((id) => allIds.add(id));
  });

  // id별로 객체 생성
  const result: TemplateMeasurementValueType[] = [];
  allIds.forEach((id) => {
    const obj: any = { id };
    (Object.keys(SIZE_RANGE_TO_KEY) as SizeRangeType[]).forEach((range) => {
      const key = SIZE_RANGE_TO_KEY[range];
      const value = input[range]?.[id];
      obj[key] = value !== undefined ? Number(value) : undefined;
    });
    result.push(obj);
  });

  return result;
}

function convertToSizeRangeTypeRecord(
  arr: GetTemplateMeasurementValuesItemType[]
): Record<SizeRangeType, Record<string, string>> {
  const result: Record<SizeRangeType, Record<string, string>> = {} as any;

  SIZE_RANGE_KEYS.forEach((range) => {
    result[range] = {};
  });

  console.log("arr: ", arr);
  arr.forEach((item) => {
    SIZE_RANGE_KEYS.forEach((range) => {
      // code가 있으면 code, 없으면 id를 key로 사용
      const key = item.id;
      // 값이 undefined/null이어도 string으로 변환
      result[range][key] = String(
        item[range as keyof GetTemplateMeasurementValuesItemType]
      );
    });
  });

  console.log("result: ", result);
  return result;
}
