import React from "react";

import { SvgPath, ChartPoint } from "../types";
import { findNearestGridPointId } from "../utils/svgGrid";

export interface AutoMappingTableProps {
  paths: SvgPath[];
  gridPoints: ChartPoint[];
  extractControlPoints: (pathData: string) => { x: number; y: number }[];
  onPathClick?: (pathId: string) => void;
  mappingItems: {
    id: string;
    name: string;
    startPoint: string | null;
    endPoint: string | null;
    controlPoints: { x: number; y: number }[] | null;
  }[];
}

export function AutoMappingTable({
  paths,
  gridPoints,
  extractControlPoints,
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
          // path의 실제 시작점과 끝점 찾기
          // let startPoint, endPoint;

          // if (p.element) {
          //   const pathLength = p.element.getTotalLength();
          //   startPoint = {
          //     x: p.element.getPointAtLength(0).x,
          //     y: p.element.getPointAtLength(0).y,
          //   };
          //   endPoint = {
          //     x: p.element.getPointAtLength(pathLength).x,
          //     y: p.element.getPointAtLength(pathLength).y,
          //   };
          // } else {
          //   // element가 없는 경우 points 배열에서 시작점과 끝점 찾기
          //   startPoint = p.points[0];
          //   endPoint = p.points[p.points.length - 1];
          // }

          // const startGridId = startPoint
          //   ? findNearestGridPointId(startPoint, gridPoints)
          //   : "-";
          // const endGridId = endPoint
          //   ? findNearestGridPointId(endPoint, gridPoints)
          //   : "-";

          // const controlPoints =
          //   p.type === "curve" ? extractControlPoints(p.data || "") : [];
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
                  {p.startPoint}
                </span>
                <span className="mx-1">→</span>
                <span className="bg-gray-100 rounded px-2 py-1">
                  {p.endPoint}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
