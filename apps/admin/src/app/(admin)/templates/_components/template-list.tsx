"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge"; // Assuming Badge component is imported
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryById } from "@/constants/category";
import { templates, chartTypes as chartTypesList, Template } from "@/lib/data";
import { templateQueries } from "@/queries/template";

export function TemplateList() {
  const { data } = useQuery(templateQueries.getTemplatesQueryOptions());
  console.log("templates: ", data);

  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const templateToDelete = templates.find((t) => t.id === deleteTemplateId);

  // 템플릿 삭제 처리
  const handleDeleteTemplate = () => {
    if (!deleteTemplateId) return;

    // 실제 구현에서는 API 호출로 서버에서 삭제
    const index = templates.findIndex((t) => t.id === deleteTemplateId);
    if (index !== -1) {
      templates.splice(index, 1);
      setDeleteTemplateId(null);
      // 서버 업데이트를 위해 페이지 새로고침 (실제 구현 시 SWR 또는 React Query로 대체)
      window.location.reload();
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">템플릿명</TableHead>
            <TableHead className="w-1/6">도구 유형</TableHead>
            <TableHead className="w-1/6">차트 유형</TableHead>
            <TableHead className="w-1/6">게시 상태</TableHead>
            <TableHead className="text-center w-1/6">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                템플릿이 없습니다. 새 템플릿 추가 버튼을 클릭하여 템플릿을
                생성해주세요.
              </TableCell>
            </TableRow>
          ) : (
            templates.map((template) => {
              // 템플릿명 자동 생성 (도구유형 제외)
              return <TemplateItem key={template.id} template={template} />;
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TemplateItem({ template }: { template: Template }) {
  // 완성된 템플릿명
  const formattedName = (() => {
    const category = getCategoryById(String(template.categoryIds[2]));
    const formatOptions = [];

    // 제작 방식 (있는 경우만)
    if (
      template.constructionMethods &&
      template.constructionMethods.length > 0
    ) {
      formatOptions.push(template.constructionMethods[0]);
    }

    // 넥라인 (있는 경우만)
    if (template.necklineType) {
      formatOptions.push(template.necklineType);
    }

    // 소매 유형 (있는 경우만)
    if (template.sleeveType) {
      formatOptions.push(template.sleeveType);
    }

    // 카테고리 소분류
    if (category) {
      formatOptions.push(category.name);
    }

    return formatOptions.join(" ");
  })();

  // 차트 유형 문자열
  const templateChartTypes =
    template.chartTypeIds
      ?.map((id) => {
        const chart = chartTypesList.find((c) => c.id === id);
        return chart ? chart.name : "";
      })
      .filter(Boolean)
      .join(", ") || "-";

  return (
    <TableRow key={template.id}>
      <TableCell className="font-medium">{formattedName}</TableCell>
      <TableCell>{template.toolType}</TableCell>
      <TableCell>{templateChartTypes}</TableCell>
      <TableCell>
        <Badge
          variant={template.publishStatus === "공개" ? "default" : "secondary"}
        >
          {template.publishStatus}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/templates/${template.id}`}>세부 치수 편집</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/templates/${template.id}/edit`}>수정</Link>
          </Button>
          <DeleteTemplateButton template={template} />
        </div>
      </TableCell>
    </TableRow>
  );
}

function DeleteTemplateButton({ template }: { template: Template }) {
  const handleDeleteTemplate = () => {
    // TODO: 삭제 처리
    // overlay.close();
    // setOpen(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>템플릿 삭제</DialogTitle>
          <DialogDescription>
            정말로 이 템플릿을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDeleteTemplate}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
