import { Ban, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MeasurementRule } from "@/lib/data";

export function DeleteNotAllowDialog({
  open,
  onOpenChange,
  ruleToDelete,
  onConfirm,
  onViewTemplatesRule,
  ruleName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleToDelete: MeasurementRule;
  onConfirm: () => void;
  onViewTemplatesRule: () => void;
  ruleName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>삭제 불가</span>
          </DialogTitle>
          <DialogDescription>
            '{ruleName}' 치수 규칙은 현재 템플릿에서 사용 중이므로 삭제할 수
            없습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200">
          <div className="text-amber-800 font-medium flex items-center gap-1">
            <Ban className="h-4 w-4" />
            다음 작업이 필요합니다:
          </div>
          <ol className="text-amber-700 list-decimal ml-5 mt-1 text-sm">
            <li>이 규칙을 사용하는 모든 템플릿을 먼저 삭제하세요.</li>
            <li>
              또는 템플릿을 수정하여 다른 치수 규칙을 사용하도록 변경하세요.
            </li>
          </ol>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onViewTemplatesRule();
            }}
          >
            연결된 템플릿 보기
          </Button>
          <Button onClick={onConfirm}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
