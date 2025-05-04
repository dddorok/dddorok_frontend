import { useQuery } from "@tanstack/react-query";
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
import { getMeasurementItemById, measurementItems } from "@/lib/data";
import { measurementRuleQueries } from "@/queries/measurement-rule";
import { GetMeasurementRuleListItemType } from "@/services/measurement-rule";

export function RuleDialog({
  ruleId,
  isOpen,
  close,
}: {
  ruleId: string;
  // viewItemsRule: GetMeasurementRuleListItemType;
  isOpen: boolean;
  close: () => void;
}) {
  const { data } = useQuery({
    ...measurementRuleQueries.getMeasurementRuleByIdQueryOptions(ruleId),
  });
  console.log("data: ", data);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-blue-600" />
              <span>"{data?.rule_name}" 측정 항목</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h3 className="font-medium mb-2 text-sm text-muted-foreground">
            측정 항목 목록 ({data?.items.length}개)
          </h3>
          <ul className="grid grid-cols-1 gap-2 mt-1 max-h-80 overflow-y-auto">
            {/* TODO: 측정 항목 목록 추가 */}
            {data?.items.map((item) => {
              // TODO: 측정 항목 item 정보 가져오는 방식 수정 필요
              const ruleItem = measurementItems.find(
                (ruleItem) =>
                  ruleItem.name.replace(/\s+/g, "") ===
                  item.label.replace(/\s+/g, "")
              );
              // const item = getMeasurementItemById(itemId);
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-2 p-2 rounded hover:bg-gray-50"
                >
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  <div>
                    <div className="font-medium">{item?.label}</div>
                    {ruleItem?.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {ruleItem.description}
                      </div>
                    )}
                    {ruleItem?.unit && (
                      <div className="text-xs text-blue-600 mt-0.5">
                        단위: {ruleItem.unit}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
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
