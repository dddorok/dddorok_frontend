"use client";

import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import { chartTypes, type ChartType } from "@/lib/data";
import { chartTypeQueries } from "@/queries/chart-type";

export function ChartTypeList() {
  const { data: chartTypesList } = useQuery(
    chartTypeQueries.getChartTypeListQueryOptions()
  );
  console.log("chartTypesList: ", chartTypesList);

  const [viewChartType, setViewChartType] = useState<ChartType | null>(null);

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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewChartType(chartType)}
                      >
                        상세보기
                      </Button>
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

      <Alert
        variant="default"
        className="bg-blue-50 border-blue-200 text-blue-800"
      >
        <Info className="h-4 w-4" />
        <AlertDescription>
          <p>
            <strong>샘플 데이터 안내:</strong> 현재 보이는 데이터는
            예시용입니다. 실제 구현 시 백엔드 API와 연동하여 실제 데이터를
            표시해야 합니다.
          </p>
          <p className="mt-1">
            <strong>연관 관계:</strong> 차트 유형은 템플릿의 chartTypeIds 배열
            필드에서 참조됩니다.
          </p>
        </AlertDescription>
      </Alert>

      {/* Chart Type Details Dialog */}
      {viewChartType && (
        <ChartTypeDetailsDialog
          open={!!viewChartType}
          onOpenChange={() => setViewChartType(null)}
          viewChartType={viewChartType}
        />
      )}
    </div>
  );
}
