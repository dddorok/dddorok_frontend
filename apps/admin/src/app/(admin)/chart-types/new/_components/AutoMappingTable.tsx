import React from "react";

import { SvgPath } from "../ChartRegistration";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AutoMappingTableProps {
  paths: SvgPath[];
  extractControlPoints: (pathData: string) => { x: number; y: number }[];
}

export function AutoMappingTable({
  paths,
  extractControlPoints,
}: AutoMappingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>path ID</TableHead>
          <TableHead>타입</TableHead>
          <TableHead>시작점</TableHead>
          <TableHead>끝점</TableHead>
          <TableHead>제어점</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paths.map((p, i) => {
          const startPoint = p.points[0];
          const endPoint = p.points[p.points.length - 1];
          const controlPoints =
            p.type === "curve" ? extractControlPoints(p.data) : [];
          return (
            <TableRow key={p.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="text-blue-600 underline cursor-pointer">
                {p.id}
              </TableCell>
              <TableCell>{p.type === "line" ? "직선" : "곡선"}</TableCell>
              <TableCell>
                {startPoint ? `(${startPoint.x}, ${startPoint.y})` : "-"}
              </TableCell>
              <TableCell>
                {endPoint ? `(${endPoint.x}, ${endPoint.y})` : "-"}
              </TableCell>
              <TableCell>
                {controlPoints.length > 0
                  ? controlPoints.map((cp) => `(${cp.x}, ${cp.y})`).join(", ")
                  : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
