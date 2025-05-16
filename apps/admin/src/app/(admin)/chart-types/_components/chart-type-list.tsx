"use client";

import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import Link from "next/link";

import { ChartDeleteDialog, ChartTypeDetailsDialog } from "./chart.dialog";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { chartTypeQueries } from "@/queries/chart-type";

export function ChartTypeList() {
  const { data: chartTypesList } = useQuery(
    chartTypeQueries.getChartTypeListQueryOptions()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">차트 유형 관리</h2>
        <p className="text-muted-foreground">
          차트 유형을 관리합니다. 새 차트 유형을 추가하거나 기존 유형을 수정할
          수 있습니다.
        </p>
      </div>

      <div className="flex justify-end">
        <Link href="/chart-types/new">
          <Button size="lg">새 차트 유형 추가</Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>차트 유형 ID</TableHead> */}
              <TableHead>차트 유형 이름</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chartTypesList?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  차트 유형이 없습니다. 새 차트 유형을 추가해주세요.
                </TableCell>
              </TableRow>
            ) : (
              chartTypesList?.map((chartType) => (
                <TableRow key={chartType.id}>
                  {/* <TableCell className="font-medium">{chartType.id}</TableCell> */}
                  <TableCell>{chartType.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <ChartTypeDetailsDialog chartType={chartType} />
                      <Link href={`/chart-types/${chartType.id}`}>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </Link>
                      <ChartDeleteDialog
                        chartId={chartType.id}
                        chartName={chartType.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
