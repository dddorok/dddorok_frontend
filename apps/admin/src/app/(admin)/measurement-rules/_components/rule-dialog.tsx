import { List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getMeasurementItemById } from "@/lib/data";
import { GetMeasurementRuleListItemType } from "@/services/measurement-rule";

export function RuleDialog({
  viewItemsRule,
  isOpen,
  close,
}: {
  viewItemsRule: GetMeasurementRuleListItemType;
  isOpen: boolean;
  close: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-blue-600" />
              <span>"{viewItemsRule.rule_name}" 측정 항목</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h3 className="font-medium mb-2 text-sm text-muted-foreground">
            측정 항목 목록 ({viewItemsRule.measurement_item_count}개)
          </h3>
          <ul className="grid grid-cols-1 gap-2 mt-1 max-h-80 overflow-y-auto">
            {/* TODO: 측정 항목 목록 추가 */}
            {/* {viewItemsRule.items.map((itemId) => {
              const item = getMeasurementItemById(itemId);
              return (
                <li
                  key={itemId}
                  className="flex items-start gap-2 p-2 rounded hover:bg-gray-50"
                >
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  <div>
                    <div className="font-medium">{item?.name || itemId}</div>
                    {item?.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    )}
                    {item?.unit && (
                      <div className="text-xs text-blue-600 mt-0.5">
                        단위: {item.unit}
                      </div>
                    )}
                  </div>
                </li>
              );
            })} */}
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            //   onClick={() => setViewItemsRule(null)}
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
