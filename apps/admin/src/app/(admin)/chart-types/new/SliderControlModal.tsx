import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export interface SliderControlRowType {
  code: string;
  label: string;
  controlStart: string;
  controlEnd: string;
  originalControl: string;
  value_type: "WIDTH" | "LENGTH";
}

interface SliderControlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  measurementItems: Array<{
    id: string;
    name: string;
    startPoint: string;
    endPoint: string;
    adjustable: boolean;
  }>;
  points: Array<{ id: string }>;
  onSave: (rows: Array<SliderControlRowType>) => void;
}

const generateControlString = (
  startPointId: string,
  endPointId: string,
  valueType: "WIDTH" | "LENGTH"
): [string, string] => {
  if (valueType === "WIDTH") {
    const startNum = startPointId.match(/\d+/)?.[0] || "";
    const endNum = endPointId.match(/\d+/)?.[0] || "";
    return [startNum, endNum];
  } else {
    const startChar = startPointId.charAt(0);
    const endChar = endPointId.charAt(0);
    return [startChar, endChar];
  }
};

function getControlDropdownPairs(points: Array<{ id: string }>) {
  // id 예시: a1, b1, c1, d1, a2, b2, ...
  const ids = points.map((p) => p.id);

  // 행(알파벳)과 열(숫자) 분리
  const rows = Array.from(new Set(ids.map((id) => id[0])))
    .filter((value) => Boolean(value))
    .sort() as string[];
  const cols = Array.from(new Set(ids.map((id) => id.slice(1))))
    .filter((value) => Boolean(value))
    .sort() as string[];

  return { rows, cols };
}

export const SliderControlModal: React.FC<SliderControlModalProps> = ({
  open,
  onOpenChange,
  measurementItems,
  points,
  onSave,
}) => {
  const [controlRows, setControlRows] = useState<Array<SliderControlRowType>>(
    []
  );

  const initialControlRow = () => {
    // 조정 가능 항목만
    const adjustableItems = measurementItems.filter(
      (item) => item.adjustable === true
    );
    // WIDTH, LENGTH 분리
    const widthItems = adjustableItems.filter((item) =>
      item.id.includes("WIDTH")
    );
    const lengthItems = adjustableItems.filter(
      (item) => !item.id.includes("WIDTH")
    );

    // 최종 rows 생성 (WIDTH 먼저, 그 다음 LENGTH)
    // TODO: 리팩토링 확인
    const rows = [
      ...widthItems.map((item) => {
        const valueType: "WIDTH" = "WIDTH";
        const [controlStart, controlEnd] = generateControlString(
          item.startPoint,
          item.endPoint,
          valueType
        );
        return {
          code: item.id,
          label: item.name,
          controlStart,
          controlEnd,
          originalControl: `${controlStart}-${controlEnd}`,
          value_type: valueType,
        };
      }),
      ...lengthItems.map((item) => {
        const valueType: "LENGTH" = "LENGTH";
        const [controlStart, controlEnd] = generateControlString(
          item.startPoint,
          item.endPoint,
          valueType
        );
        return {
          code: item.id,
          label: item.name,
          controlStart,
          controlEnd,
          originalControl: `${controlStart}-${controlEnd}`,
          value_type: valueType,
        };
      }),
    ];
    setControlRows(rows);
  };

  useEffect(() => {
    if (!open) return;
    // 조정 가능 항목만
    initialControlRow();
  }, [open, measurementItems, points]);

  const { rows: rowsOptions, cols: colsOptions } =
    getControlDropdownPairs(points);
  const handleControlDropdownChange = (idx: number, value: string) => {
    setControlRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, controlStart: value } : row))
    );
  };

  const handleControlDropdownEndChange = (idx: number, value: string) => {
    setControlRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, controlEnd: value } : row))
    );
  };

  const handleSave = () => {
    // TODO: 중복로직 체트 검토
    // control 중복 체크
    // const controls = controlRows.map((row) => row.controlStart.trim());
    // const hasDuplicate = controls.some(
    //   (c, i) => c && controls.indexOf(c) !== i
    // );
    // if (hasDuplicate) {
    //   alert("control 값이 중복됩니다. 각 control은 고유해야 합니다.");
    //   return;
    // }
    const rows = controlRows.map((row) => ({
      ...row,
      control: `${row.controlStart}-${row.controlEnd}`,
    }));
    onSave(rows);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>슬라이더 컨트롤 범위 검토</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-xs font-medium border-b text-gray-700">
                  코드
                </th>
                <th className="px-2 py-2 text-xs font-medium border-b text-gray-700">
                  라벨
                </th>
                <th className="px-2 py-2 text-xs font-medium border-b text-gray-700">
                  control(드롭다운)
                </th>
                <th className="px-2 py-2 text-xs font-medium border-b text-gray-500">
                  originalControl
                </th>
              </tr>
            </thead>
            <tbody>
              {controlRows.map((row, idx) => (
                <ControlRow
                  key={row.code}
                  row={row}
                  options={
                    row.value_type === "WIDTH" ? colsOptions : rowsOptions
                  }
                  handleControlDropdownChange={(value) =>
                    handleControlDropdownChange(idx, value)
                  }
                  handleControlDropdownEndChange={(value) =>
                    handleControlDropdownEndChange(idx, value)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>저장</Button>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function ControlRow({
  row,
  options,
  handleControlDropdownChange,
  handleControlDropdownEndChange,
}: {
  row: SliderControlRowType;
  options: string[];
  handleControlDropdownChange: (value: string) => void;
  handleControlDropdownEndChange: (value: string) => void;
}) {
  console.log("row: ", row);
  return (
    <tr key={row.code} className="hover:bg-gray-50">
      <td className="px-2 py-2 text-xs border-b font-mono text-gray-600 bg-gray-100">
        {row.code}
      </td>
      <td className="px-2 py-2 text-xs border-b text-gray-700">{row.label}</td>
      <td className="px-2 py-2 border-b">
        <select
          name=""
          id=""
          value={row.controlStart}
          onChange={(e) => handleControlDropdownChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <select
          name=""
          id=""
          value={row.controlEnd}
          onChange={(e) => handleControlDropdownEndChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </td>
      <td className="px-2 py-2 border-b text-xs text-gray-500 bg-gray-50 text-center">
        {row.originalControl}
      </td>
    </tr>
  );
}
