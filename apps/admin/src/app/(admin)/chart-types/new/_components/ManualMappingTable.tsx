import React from "react";

import { MeasurementItem } from "../types";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ManualMappingTableProps {
  measurementItems: MeasurementItem[];
  selectedPathId: string | null;
  selectedPointIndex: number;
  handlePathIdClick: (pathId: string) => void;
  onAdjustableChange: (id: string, adjustable: boolean) => void;
}

export function ManualMappingTable({
  measurementItems,
  selectedPathId,
  selectedPointIndex,
  handlePathIdClick,
  onAdjustableChange,
}: ManualMappingTableProps) {
  return (
    <table className="w-full border text-xs mb-2">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="border px-2 py-1">No.</th>
          <th className="border px-2 py-1">path ID</th>
          <th className="border px-2 py-1">항목명</th>
          <th className="border px-2 py-1">시작점</th>
          <th className="border px-2 py-1">끝점</th>
          <th className="border px-2 py-1">조정 가능</th>
          <th className="border px-2 py-1">선택</th>
        </tr>
      </thead>
      <tbody>
        {measurementItems.map((item, i) => (
          <tr key={item.id} className="text-gray-700">
            <td className="border px-2 py-1 text-center">{i + 1}</td>
            <td className="border px-2 py-1">{item.id}</td>
            <td className="border px-2 py-1">{item.name}</td>
            <td className="border px-2 py-1 text-center">
              <span
                className={`bg-gray-100 rounded px-2 py-1 ${
                  selectedPathId === item.id && selectedPointIndex === 0
                    ? "bg-blue-100"
                    : ""
                }`}
              >
                {item.startPoint || "-"}
              </span>
            </td>
            <td className="border px-2 py-1 text-center">
              <span
                className={`bg-gray-100 rounded px-2 py-1 ${
                  selectedPathId === item.id && selectedPointIndex === 1
                    ? "bg-blue-100"
                    : ""
                }`}
              >
                {item.endPoint || "-"}
              </span>
            </td>
            <td className="border px-2 py-1 text-center">
              <Switch
                checked={item.adjustable}
                onCheckedChange={(checked) =>
                  onAdjustableChange(item.id, checked)
                }
              />
            </td>
            <td className="border px-2 py-1 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePathIdClick(item.id)}
                className={selectedPathId === item.id ? "bg-blue-100" : ""}
              >
                선택
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
