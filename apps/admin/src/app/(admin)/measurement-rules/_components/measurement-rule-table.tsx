"use client";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useOverlay } from "@toss/use-overlay";
import { List, Layers } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import {
  DeleteNotAllowDialog,
  MeasurementRuleRelatedTemplateDialog,
} from "./delete-not-allow-dialog";
import { RuleDialog } from "./rule-dialog";

import { ConfirmDialog } from "@/components/Dialog/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  measurementRuleQueries,
  measurementRuleQueryKeys,
} from "@/queries/measurement-rule";
import {
  deleteMeasurementRule,
  GetMeasurementRuleListItemType,
} from "@/services/measurement-rule";

export function MeasurementRuleTable() {
  const { data } = useSuspenseQuery({
    ...measurementRuleQueries.list(),
  });

  const measurementRules = data?.data || [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>규칙 이름</TableHead>
          <TableHead>측정 항목 수</TableHead>
          <TableHead>사용상태</TableHead>
          <TableHead className="text-center">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {measurementRules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">
              치수 규칙이 없습니다. 새 치수 규칙을 추가해주세요.
            </TableCell>
          </TableRow>
        ) : (
          measurementRules.map((rule) => {
            return <TableItem rule={rule} key={rule.id} />;
          })
        )}
      </TableBody>
    </Table>
  );
}

function TableItem({ rule }: { rule: GetMeasurementRuleListItemType }) {
  const queryClient = useQueryClient();
  const overlay = useOverlay();

  const templateCount = rule.template_count;
  const isDeletable = templateCount === 0;

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    // 삭제 가능 여부 확인 후 적절한 다이얼로그 표시
    if (isDeletable) {
      overlay.open(({ isOpen, close }) => (
        <ConfirmDialog
          open={isOpen}
          onOpenChange={close}
          onAction={() => {
            console.log("delete");
            deleteMeasurementRule(rule.id)
              .then(() => {
                toast({
                  title: "치수 규칙 삭제 완료",
                  description: "치수 규칙이 성공적으로 삭제되었습니다.",
                });
                close();
                queryClient.invalidateQueries({
                  queryKey: measurementRuleQueryKeys.all(),
                });
              })
              .catch((error) => {
                console.error("치수 규칙 삭제 실패", error);
                toast({
                  title: "치수 규칙 삭제 실패",
                  description: "치수 규칙 삭제 중 오류가 발생했습니다.",
                });
              });
          }}
          title="치수 규칙 삭제"
          description={
            <>
              {/* '{ruleToDelete?.name}'  */}
              치수 규칙을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </>
          }
        />
      ));
    } else {
      overlay.open(({ isOpen, close }) => (
        <DeleteNotAllowDialog
          open={isOpen}
          onOpenChange={close}
          ruleToDelete={rule}
          onConfirm={() => {
            console.log("delete");
            close();
          }}
        />
      ));
    }
  };

  const onViewItemsRule = (rule: GetMeasurementRuleListItemType) => {
    overlay.open(({ isOpen, close }) => (
      <RuleDialog ruleId={rule.id} isOpen={isOpen} close={close} />
    ));
  };

  return (
    <TableRow key={rule.id}>
      <TableCell className="font-medium">{rule.rule_name}</TableCell>

      {/* 측정 항목 수 클릭 가능 */}
      <TableCell>
        <Button
          variant="ghost"
          className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
          onClick={() => onViewItemsRule(rule)}
        >
          <List className="h-3 w-3" />
          {rule.measurement_item_count}개
        </Button>
      </TableCell>

      {/* 템플릿 수 클릭 가능 */}
      <TableCell>
        <Button
          variant="ghost"
          className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
          onClick={() => {
            overlay.open(({ isOpen, close }) => (
              <Suspense>
                <MeasurementRuleRelatedTemplateDialog
                  ruleId={rule.id}
                  ruleName={rule.rule_name}
                  open={isOpen}
                  onOpenChange={close}
                />
              </Suspense>
            ));
          }}
          disabled={templateCount === 0}
        >
          <Layers className="h-3 w-3" />
          <Badge
            variant="outline"
            className={templateCount === 0 ? "bg-gray-100" : ""}
          >
            {templateCount}개
          </Badge>
        </Button>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={!isDeletable}
            className={cn(
              !isDeletable ? "text-gray-400 pointer-events-none" : ""
            )}
          >
            <Link href={!isDeletable ? "#" : `/measurement-rules/${rule.id}`}>
              규칙 수정
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${isDeletable ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-gray-400"}`}
            onClick={() => handleDeleteClick()}
          >
            삭제
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
