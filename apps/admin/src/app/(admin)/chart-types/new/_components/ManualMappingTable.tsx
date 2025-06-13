import React from "react";

import { MeasurementItem } from "../ChartRegistration";

export interface ManualMappingTableProps {
  measurementItems: MeasurementItem[];
  selectedPathId: string | null;
  selectedPointIndex: number;
  handlePathIdClick: (pathId: string) => void;
}

const ManualMappingTable: React.FC<ManualMappingTableProps> = ({
  measurementItems,
  selectedPathId,
  selectedPointIndex,
  handlePathIdClick,
}) => {
  return (
    <table className="w-full border text-xs">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="border px-2 py-1">No.</th>
          <th className="border px-2 py-1">path ID</th>
          <th className="border px-2 py-1">측정항목</th>
          <th className="border px-2 py-1">시작점 - 번호</th>
          <th className="border px-2 py-1">끝점 - 번호</th>
          <th className="border px-2 py-1">슬라이더 조정</th>
        </tr>
      </thead>
      <tbody>
        {measurementItems.map((m, i) => (
          <tr key={m.id}>
            <td className="border px-2 py-1 text-center">{i + 1}</td>
            <td
              className={`border px-2 py-1 text-blue-600 underline cursor-pointer ${selectedPathId === m.id ? "bg-blue-50" : ""}`}
              onClick={() => handlePathIdClick(m.id)}
            >
              {m.id}
            </td>
            <td className="border px-2 py-1">{m.name}</td>
            <td className="border px-2 py-1">
              {m.startPoint ||
                (selectedPathId === m.id && selectedPointIndex === 0
                  ? "선택 중..."
                  : "선택")}
            </td>
            <td className="border px-2 py-1">
              {m.endPoint ||
                (selectedPathId === m.id && selectedPointIndex === 1
                  ? "선택 중..."
                  : "선택")}
            </td>
            <td className="border px-2 py-1 text-center">
              <input type="checkbox" checked={m.adjustable} readOnly />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ManualMappingTable;
