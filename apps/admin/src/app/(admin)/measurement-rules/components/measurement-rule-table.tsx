"use client";

import { useOverlay } from "@toss/use-overlay";
import { List, Layers } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DeleteNotAllowDialog } from "./delete-not-allow-dialog";
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
import {
  type MeasurementRule,
  measurementRules as originalMeasurementRules,
  getCategoryById,
  templates,
} from "@/lib/data";

export function MeasurementRuleTable() {
  const overlay = useOverlay();

  const [measurementRules, setMeasurementRules] = useState<MeasurementRule[]>(
    originalMeasurementRules
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>규칙 이름</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>소매 유형</TableHead>
          <TableHead>측정 항목 수</TableHead>
          <TableHead>템플릿 수</TableHead>
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
            const templateCount = 0;
            // const templateCount = getTemplateCount(rule.id);
            const isDeletable = templateCount === 0;

            return <TableItem rule={rule} />;
          })
        )}
      </TableBody>
    </Table>
  );
}

function TableItem({ rule }: { rule: any }) {
  const overlay = useOverlay();

  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);
  const [viewItemsRule, setViewItemsRule] = useState<MeasurementRule | null>(
    null
  );
  const [viewTemplatesRule, setViewTemplatesRule] =
    useState<MeasurementRule | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  // 해당 규칙을 사용하는 템플릿 개수 계산
  const getTemplateCount = (ruleId: string) => {
    return templates.filter((template) => template.measurementRuleId === ruleId)
      .length;
  };

  const templateCount = getTemplateCount(rule.id);
  const isDeletable = templateCount === 0;

  // Function to get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : "알 수 없음";
  };

  // 해당 규칙을 사용하는 템플릿 목록 가져오기
  const getTemplatesByRuleId = (ruleId: string) => {
    return templates.filter(
      (template) => template.measurementRuleId === ruleId
    );
  };

  // 삭제 가능 여부 확인
  const canDeleteRule = (ruleId: string) => {
    return getTemplateCount(ruleId) === 0;
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (ruleId: string) => {
    setDeleteRuleId(ruleId);

    // 삭제 가능 여부 확인 후 적절한 다이얼로그 표시
    if (canDeleteRule(ruleId)) {
      // setIsDeleteDialogOpen(true);
      overlay.open(({ isOpen, close }) => (
        <ConfirmDialog
          open={isOpen}
          onOpenChange={close}
          onAction={() => {
            console.log("delete");
            close();
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

  const onViewItemsRule = (rule: MeasurementRule) => {
    console.log("rule: ", rule);
    overlay.open(({ isOpen, close }) => (
      <RuleDialog viewItemsRule={rule} isOpen={isOpen} close={close} />
    ));
  };

  return (
    <TableRow key={rule.id}>
      <TableCell className="font-medium">{rule.name}</TableCell>
      <TableCell>{getCategoryName(rule.categoryId)}</TableCell>
      <TableCell>{rule.sleeveType || "-"}</TableCell>

      {/* 측정 항목 수 클릭 가능 */}
      <TableCell>
        <Button
          variant="ghost"
          className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
          onClick={() => onViewItemsRule(rule)}
        >
          <List className="h-3 w-3" />
          {rule.items.length}개
        </Button>
      </TableCell>

      {/* 템플릿 수 클릭 가능 */}
      <TableCell>
        <Button
          variant="ghost"
          className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
          onClick={() => setViewTemplatesRule(rule)}
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
          <Link href={`/measurement-rules/${rule.id}`}>
            <Button variant="outline" size="sm">
              규칙 수정
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className={`${isDeletable ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-gray-400"}`}
            onClick={() => handleDeleteClick(rule.id)}
          >
            삭제
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
