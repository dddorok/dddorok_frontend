import { useOverlay } from "@toss/use-overlay";
import { Layers } from "lucide-react";
import Link from "next/link";

import { ConfirmDialog } from "@/components/Dialog/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDefaultProps,
} from "@/components/ui/dialog";
import { MeasurementRule, Template } from "@/lib/data";

export function TemplateRuleDialog({
  viewTemplatesRule,
  isOpen,
  close,
  templates,
}: {
  viewTemplatesRule: MeasurementRule;
  isOpen: boolean;
  close: () => void;
  templates: Template[];
}) {
  const overlay = useOverlay();
  // 해당 규칙을 사용하는 템플릿 목록 가져오기
  const getTemplatesByRuleId = (ruleId: string) => {
    return templates.filter(
      (template) => template.measurementRuleId === ruleId
    );
  };

  const onDelete = () => {
    // setViewTemplatesRule(null);
    // setDeleteRuleId(viewTemplatesRule.id);
    // setIsDeleteDialogOpen(true);
    console.log("delete");
    overlay.open(({ isOpen, close }) => (
      <ConfirmDialog
        open={isOpen}
        onOpenChange={close}
        onAction={() => console.log("delete")}
        title="치수 규칙 삭제"
        description={
          <>
            {/* '{ruleToDelete?.name}'  */}
            치수 규칙을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </>
        }
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              <span>"{viewTemplatesRule.name}" 연결 템플릿</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {(() => {
            const relatedTemplates = getTemplatesByRuleId(viewTemplatesRule.id);

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
                            {template.toolType} / {template.patternType}
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
          <div>
            {/* 연결된 템플릿이 없는 경우에만 삭제 버튼 표시 */}
            {getTemplatesByRuleId(viewTemplatesRule.id).length === 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDelete();
                  // setViewTemplatesRule(null);
                  // setDeleteRuleId(viewTemplatesRule.id);
                  // setIsDeleteDialogOpen(true);
                }}
              >
                삭제하기
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={close}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
