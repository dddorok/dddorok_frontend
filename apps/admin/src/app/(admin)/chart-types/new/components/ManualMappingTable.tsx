import React from "react";

import { MeasurementItem } from "../ChartRegistration";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ManualMappingTableProps {
  measurementItems: MeasurementItem[];
  selectedPathId: string | null;
  selectedPointIndex: number;
  handlePathIdClick: (pathId: string) => void;
}

export function ManualMappingTable({
  measurementItems,
  selectedPathId,
  selectedPointIndex,
  handlePathIdClick,
}: ManualMappingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>path ID</TableHead>
          <TableHead>측정항목</TableHead>
          <TableHead>시작점 - 번호</TableHead>
          <TableHead>끝점 - 번호</TableHead>
          <TableHead>슬라이더 조정</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {measurementItems.map((m, i) => (
          <TableRow key={m.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell
              className={`text-blue-600 underline cursor-pointer ${selectedPathId === m.id ? "bg-blue-50" : ""}`}
              onClick={() => handlePathIdClick(m.id)}
            >
              {m.id}
            </TableCell>
            <TableCell>{m.name}</TableCell>
            <TableCell>
              {m.startPoint ||
                (selectedPathId === m.id && selectedPointIndex === 0
                  ? "선택 중..."
                  : "선택")}
            </TableCell>
            <TableCell>
              {m.endPoint ||
                (selectedPathId === m.id && selectedPointIndex === 1
                  ? "선택 중..."
                  : "선택")}
            </TableCell>
            <TableCell>
              <Checkbox checked={m.adjustable} disabled />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
