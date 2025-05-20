"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@toss/use-overlay";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { ConfirmDialog } from "@/components/Dialog/ConfirmDialog";
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
import { NEEDLE, NeedleType } from "@/constants/template";
import { toast } from "@/hooks/use-toast";
import { templateQueries, templateQueryKeys } from "@/queries/template";
import {
  deleteTemplate,
  TemplateType,
  updateTemplatePublishStatus,
} from "@/services/template/template";

export function TemplateList({
  filterOptions,
}: {
  filterOptions: {
    needleType: NeedleType | null;
  };
}) {
  const { data: templates } = useQuery(templateQueries.list());

  const viewTemplateList = templates?.filter((template) => {
    if (filterOptions.needleType === null) return true;
    return template.needle_type === filterOptions.needleType;
  });

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">템플릿명</TableHead>
            <TableHead className="w-1/6">도구 유형</TableHead>
            <TableHead className="w-1/6">게시 상태</TableHead>
            <TableHead className="text-center w-1/6">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                템플릿이 없습니다. 새 템플릿 추가 버튼을 클릭하여 템플릿을
                생성해주세요.
              </TableCell>
            </TableRow>
          )}
          {templates?.length !== 0 && viewTemplateList?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                검색 조건에 맞는 템플릿이 없습니다.
              </TableCell>
            </TableRow>
          )}
          {viewTemplateList?.map((template) => {
            // 템플릿명 자동 생성 (도구유형 제외)
            return <TemplateItem key={template.id} template={template} />;
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function TemplateItem({ template }: { template: TemplateType }) {
  const overlay = useOverlay();
  const queryClient = useQueryClient();
  return (
    <TableRow key={template.id}>
      <TableCell className="font-medium">{template.name}</TableCell>
      <TableCell>{NEEDLE[template.needle_type].label ?? "-"}</TableCell>

      <TableCell>
        <Badge variant={template.is_published ? "default" : "secondary"}>
          {template.is_published ? "공개" : "비공개"}
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
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            overlay.open(({ close, isOpen }) => (
              <ConfirmDialog
                title={
                  template.is_published ? "템플릿 게시 취소" : "템플릿 게시"
                }
                description={
                  template.is_published
                    ? "템플릿을 게시 취소 하시겠습니까?"
                    : "템플릿을 게시 하시겠습니까?"
                }
                open={isOpen}
                onOpenChange={close}
                actionVariant="default"
                actionText={template.is_published ? "게시 취소" : "게시"}
                onAction={() => {
                  console.log("template: ", template);
                  updateTemplatePublishStatus({
                    template_id: template.id,
                    is_published: !template.is_published,
                  }).then(() => {
                    toast({
                      title: "템플릿 게시/취소 성공",
                      description: "템플릿이 성공적으로 게시/취소되었습니다.",
                    });
                    queryClient.invalidateQueries({
                      queryKey: templateQueries.list().queryKey,
                    });
                    close();
                  });
                }}
              />
            ));
          }}
        >
          <MoreHorizontal />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function DeleteTemplateButton({ template }: { template: TemplateType }) {
  const queryClient = useQueryClient();

  const handleDeleteTemplate = async () => {
    try {
      await deleteTemplate(template.id);
      toast({
        title: "템플릿 삭제 성공",
        description: "템플릿이 성공적으로 삭제되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.all() });
    } catch (error) {
      console.error("error: ", error);
    }
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
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              삭제
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
