import React from "react";

import { MeasurementItem } from "../new/types";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ManualMappingTableProps {
  measurementItems: MeasurementItem[];
}

export function ManualMappingTable({
  measurementItems,
}: ManualMappingTableProps) {
  return (
    <div className="space-y-4">
      <table className="w-full border text-xs mb-2">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-2 py-1">No.</th>
            <th className="border px-2 py-1">path ID</th>
            <th className="border px-2 py-1">항목명</th>
            <th className="border px-2 py-1">시작점</th>
            <th className="border px-2 py-1">끝점</th>
            <th className="border px-2 py-1">조정 가능</th>
          </tr>
        </thead>
        <tbody>
          {measurementItems.map((item, i) => (
            <tr key={item.id} className="text-gray-700">
              <td className="border px-2 py-1 text-center">{i + 1}</td>
              <td className="border px-2 py-1">{item.id}</td>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1 text-center">
                <span>{item.startPoint || "-"}</span>
              </td>
              <td className="border px-2 py-1 text-center">
                <span>{item.endPoint || "-"}</span>
              </td>
              <td className="border px-2 py-1 text-center">
                <Switch checked={item.adjustable} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
