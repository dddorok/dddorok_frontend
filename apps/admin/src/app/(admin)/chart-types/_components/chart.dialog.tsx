import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDefaultProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function ChartDeleteDialog(
  props: DialogDefaultProps & {
    chartTypeToDelete: any;
  }
) {
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
        description: `"${props.chartTypeToDelete?.name}" 차트 유형이 삭제되었습니다.`,
      });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            // setDeleteChartTypeId(chartType.id);
            // setIsDeleteDialogOpen(true);
          }}
        >
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>차트 유형 삭제</DialogTitle>
          <DialogDescription>
            '{props.chartTypeToDelete?.name}' 차트 유형을 정말 삭제하시겠습니까?
            이 작업은 되돌릴 수 없으며, 이 차트 유형을 사용하는 템플릿에 영향을
            줄 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => props.onOpenChange(false)}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleDeleteChartType}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ChartTypeDetailsDialog(
  props: DialogDefaultProps & { viewChartType: any }
) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{props.viewChartType.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">차트 유형 ID</p>
                <p>{props.viewChartType.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">차트 유형 이름</p>
                <p>{props.viewChartType.name}</p>
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
          <Link href={`/chart-types/${props.viewChartType.id}`}>
            <Button>차트 유형 수정</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
