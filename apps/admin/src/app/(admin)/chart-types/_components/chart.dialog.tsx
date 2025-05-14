import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { chartTypeQueries } from "@/queries/chart-type";
import { ChartTypeItemType, deleteChartType } from "@/services/chart-type";

export function ChartDeleteDialog(props: {
  chartId: string;
  chartName: string;
}) {
  const queryClient = useQueryClient();
  // 차트 유형 삭제 함수
  const handleDeleteChartType = () => {
    deleteChartType(props.chartId).then(() => {
      queryClient.invalidateQueries({
        queryKey: chartTypeQueries.getChartTypeListQueryOptions().queryKey,
      });
    });

    toast({
      title: "삭제 완료",
      description: `"${props.chartName}" 차트 유형이 삭제되었습니다.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>차트 유형 삭제</DialogTitle>
          <DialogDescription>
            '{props.chartName}' 차트 유형을 정말 삭제하시겠습니까? 이 작업은
            되돌릴 수 없으며, 이 차트 유형을 사용하는 템플릿에 영향을 줄 수
            있습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDeleteChartType}>
              삭제
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ChartTypeDetailsDialog(props: {
  chartType: ChartTypeItemType;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          상세보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{props.chartType.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">차트 유형 ID</p>
                <p>{props.chartType.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">차트 유형 이름</p>
                <p>{props.chartType.name}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              <strong>개발 참고:</strong> 실제 구현 시 이 다이얼로그에 차트
              유형을 사용하는 템플릿 목록 표시 기능 추가 필요
            </p>
          </div>
        </div>
        <DialogFooter>
          <Link href={`/chart-types/${props.chartType.id}`}>
            <Button>차트 유형 수정</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
