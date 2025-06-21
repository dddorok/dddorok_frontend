import { SvgPath, ChartPoint, PathDefinition } from "@dddorok/utils";
import React from "react";

export interface AutoMappingTableProps {
  paths: SvgPath[];
  gridPoints: ChartPoint[];
  onPathClick?: (pathId: string) => void;
  mappingItems: PathDefinition[];
}

export function AutoMappingTable({
  onPathClick,
  mappingItems,
}: AutoMappingTableProps) {
  return (
    <table className="w-full border text-xs mb-2">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="border px-2 py-1">No.</th>
          <th className="border px-2 py-1">path ID</th>
          <th className="border px-2 py-1">항목명</th>
          <th className="border px-2 py-1">제어점</th>
          <th className="border px-2 py-1">시작점 - 끝점</th>
        </tr>
      </thead>
      <tbody>
        {mappingItems.map((p, i) => {
          return (
            <tr key={p.id} className="text-gray-700">
              <td className="border px-2 py-1 text-center">{i + 1}</td>
              <td
                className="border px-2 py-1 text-blue-600 underline cursor-pointer"
                onClick={() => onPathClick?.(p.id)}
              >
                {p.id}
              </td>
              <td className="border px-2 py-1">-</td>
              <td className="border px-2 py-1">
                {p.controlPoints && p.controlPoints.length > 0
                  ? p.controlPoints.map((cp) => `(${cp.x}, ${cp.y})`).join(", ")
                  : "-"}
              </td>
              <td className="border px-2 py-1 text-center">
                <span className="bg-gray-100 rounded px-2 py-1 mr-1">
                  {p.points[0]}
                </span>
                <span className="mx-1">→</span>
                <span className="bg-gray-100 rounded px-2 py-1">
                  {p.points[1]}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
