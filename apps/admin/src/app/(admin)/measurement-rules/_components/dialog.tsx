import { useSuspenseQuery } from "@tanstack/react-query";
import { useOverlay } from "@toss/use-overlay";
import { Ban, Layers, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { GetMeasurementRuleListItemType } from "@/services/measurement-rule";

export function DeleteNotAllowDialog({
  open,
  onOpenChange,
  ruleToDelete,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleToDelete: GetMeasurementRuleListItemType;
  onConfirm: () => void;
}) {
  const overlay = useOverlay();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>삭제 불가</span>
          </DialogTitle>
          <DialogDescription>
            "{ruleToDelete.rule_name}" 치수 규칙은 현재 템플릿에서 사용 중이므로
            삭제할 수 없습니다.
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
              onOpenChange(false);
              overlay.open(({ isOpen, close }) => (
                <MeasurementRuleRelatedTemplateDialog
                  open={isOpen}
                  onOpenChange={close}
                  ruleId={ruleToDelete.id}
                  ruleName={ruleToDelete.rule_name}
                  onDelete={() => {
                    close();
                    onConfirm();
                  }}
                />
              ));
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

export function MeasurementRuleRelatedTemplateDialog({
  ruleId,
  open,
  onOpenChange,
  ruleName,
  onDelete,
}: {
  ruleId: string;
  ruleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
}) {
  const { data: relatedTemplates } = useSuspenseQuery({
    ...measurementRuleQueries.templateListByRuleId(ruleId),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              <span>"{ruleName}" 연결 템플릿</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {(() => {
            // const relatedTemplates = getTemplatesByRuleId(viewTemplatesRule.id);

            if (relatedTemplates.length === 0) {
              return (
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-gray-500">연결된 템플릿이 없습니다.</p>
                </div>
              );
            }

            return (
              <>
                <h3 className="font-medium mb-2 text-sm text-muted-foreground">
                  템플릿 목록 ({relatedTemplates.length}개)
                </h3>
                <ul className="divide-y max-h-80 overflow-y-auto">
                  {relatedTemplates.map((template) => (
                    <li key={template.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {template.needle_type} / {template.chart_type}
                          </p>
                        </div>
                        <Link href={`/templates/${template.id}`}>
                          <Button variant="ghost" size="sm">
                            보기
                          </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            );
          })()}
        </div>

        <DialogFooter className="flex justify-between items-center">
          {relatedTemplates.length === 0 && onDelete && (
            <Button variant="outline" onClick={onDelete}>
              삭제하기
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function MeasurementRuleRelatedChartDialog({
  ruleId,
  open,
  onOpenChange,
  ruleName,
  onDelete,
}: {
  ruleId: string;
  ruleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
}) {
  const { data: relatedTemplates } = useSuspenseQuery({
    ...measurementRuleQueries.chartTypeListByRuleId(ruleId),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              <span>"{ruleName}" 연결 템플릿</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {(() => {
            if (relatedTemplates.length === 0) {
              return (
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-gray-500">연결된 템플릿이 없습니다.</p>
                </div>
              );
            }

            return (
              <>
                <h3 className="font-medium mb-2 text-sm text-muted-foreground">
                  템플릿 목록 ({relatedTemplates.length}개)
                </h3>
                <ul className="divide-y max-h-80 overflow-y-auto">
                  {relatedTemplates.map((template) => (
                    <li key={template.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{template.name}</p>
                        </div>
                        <Link href={`/chart-types/${template.id}`}>
                          <Button variant="ghost" size="sm">
                            보기
                          </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            );
          })()}
        </div>

        <DialogFooter className="flex justify-between items-center">
          {relatedTemplates.length === 0 && onDelete && (
            <Button variant="outline" onClick={onDelete}>
              삭제하기
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
