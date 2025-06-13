import React from "react";

import { SvgPath } from "../ChartRegistration";

export interface AutoMappingTableProps {
  paths: SvgPath[];
  extractControlPoints: (pathData: string) => { x: number; y: number }[];
}

const AutoMappingTable: React.FC<AutoMappingTableProps> = ({
  paths,
  extractControlPoints,
}) => {
  return (
    <table className="w-full border text-xs mb-2">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="border px-2 py-1">No.</th>
          <th className="border px-2 py-1">path ID</th>
          <th className="border px-2 py-1">타입</th>
          <th className="border px-2 py-1">시작점</th>
          <th className="border px-2 py-1">끝점</th>
          <th className="border px-2 py-1">제어점</th>
        </tr>
      </thead>
      <tbody>
        {paths.map((p, i) => {
          const startPoint = p.points[0];
          const endPoint = p.points[p.points.length - 1];
          const controlPoints =
            p.type === "curve" ? extractControlPoints(p.data) : [];
          return (
            <tr key={p.id} className="text-gray-700">
              <td className="border px-2 py-1 text-center">{i + 1}</td>
              <td className="border px-2 py-1 text-blue-600 underline cursor-pointer">
                {p.id}
              </td>
              <td className="border px-2 py-1">
                {p.type === "line" ? "직선" : "곡선"}
              </td>
              <td className="border px-2 py-1">
                {startPoint ? `(${startPoint.x}, ${startPoint.y})` : "-"}
              </td>
              <td className="border px-2 py-1">
                {endPoint ? `(${endPoint.x}, ${endPoint.y})` : "-"}
              </td>
              <td className="border px-2 py-1">
                {controlPoints.length > 0
                  ? controlPoints.map((cp) => `(${cp.x}, ${cp.y})`).join(", ")
                  : "-"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AutoMappingTable;
