"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ChartDeleteDialog, ChartTypeDetailsDialog } from "./chart.dialog";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { chartTypes, type ChartType } from "@/lib/data";

export function ChartTypeList() {
  const [chartTypesList, setChartTypesList] = useState<ChartType[]>(chartTypes);
  const [deleteChartTypeId, setDeleteChartTypeId] = useState<string | null>(
    null
  );
  const [viewChartType, setViewChartType] = useState<ChartType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const chartTypeToDelete = chartTypesList.find(
    (ct) => ct.id === deleteChartTypeId
  );

  // 차트 유형 삭제 함수
  const handleDeleteChartType = () => {
    if (deleteChartTypeId) {
      // 현재 chartTypesList 배열에서 해당 ID를 가진 항목을 제외한 새 배열 생성
      const updatedChartTypes = chartTypesList.filter(
        (ct) => ct.id !== deleteChartTypeId
      );

      // 상태 업데이트
      setChartTypesList(updatedChartTypes);
      setIsDeleteDialogOpen(false);
      setDeleteChartTypeId(null);

      // 성공 메시지 표시
      toast({
        title: "삭제 완료",
        description: `"${chartTypeToDelete?.name}" 차트 유형이 삭제되었습니다.`,
      });
    }
  };

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
              <TableHead>차트 유형 ID</TableHead>
              <TableHead>차트 유형 이름</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chartTypesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10">
                  차트 유형이 없습니다. 새 차트 유형을 추가해주세요.
                </TableCell>
              </TableRow>
            ) : (
              chartTypesList.map((chartType) => (
                <TableRow key={chartType.id}>
                  <TableCell className="font-medium">{chartType.id}</TableCell>
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
                      <ChartDeleteDialog />
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
