import React from "react";

import { SvgPath, ChartPoint } from "../types";
import { findNearestGridPointId } from "../utils/svgGrid";

export interface AutoMappingTableProps {
  paths: SvgPath[];
  gridPoints: ChartPoint[];
  extractControlPoints: (pathData: string) => { x: number; y: number }[];
}

export function AutoMappingTable({
  paths,
  gridPoints,
  extractControlPoints,
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
        {paths.map((p, i) => {
          const startPoint = p.points[0];
          const endPoint = p.points[p.points.length - 1];
          const startGridId = startPoint
            ? findNearestGridPointId(startPoint, gridPoints)
            : "-";
          const endGridId = endPoint
            ? findNearestGridPointId(endPoint, gridPoints)
            : "-";
          const controlPoints =
            p.type === "curve" ? extractControlPoints(p.data || "") : [];
          return (
            <tr key={p.id} className="text-gray-700">
              <td className="border px-2 py-1 text-center">{i + 1}</td>
              <td className="border px-2 py-1 text-blue-600 underline cursor-pointer">
                {p.id}
              </td>
              <td className="border px-2 py-1">-</td>
              <td className="border px-2 py-1">
                {controlPoints.length > 0
                  ? controlPoints.map((cp) => `(${cp.x}, ${cp.y})`).join(", ")
                  : "-"}
              </td>
              <td className="border px-2 py-1 text-center">
                <span className="bg-gray-100 rounded px-2 py-1 mr-1">
                  {startGridId}
                </span>
                <span className="mx-1">→</span>
                <span className="bg-gray-100 rounded px-2 py-1">
                  {endGridId}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
