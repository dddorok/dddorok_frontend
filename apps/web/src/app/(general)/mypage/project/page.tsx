/* eslint-disable @next/next/no-img-element */
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { overlay } from "overlay-kit";
import { toast } from "sonner";

import { AlertDialog } from "@/components/common/Dialog/AlertDialog";
import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";
import { projectQueries, projectQueryKey } from "@/queries/project";
import { deleteProject } from "@/services/project";

export default function MyPage() {
  const { data: myProjectList } = useQuery({
    ...projectQueries.myProjectList(),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return (
    <div>
      {/* TODO: 폰트 수정 */}
      <h1 className="leading-[58px] text-[21px] font-semibold text-neutral-N900 ">
        나의 프로젝트
      </h1>
      <button onClick={() => toast.success("테스트")}>테스트</button>
      {myProjectList?.length === 0 && (
        <div className="flex flex-col mt-3 items-center gap-6">
          <>
            <p className="text-h3 text-center text-neutral-N500">
              현재 저장된 템플릿이 없습니다. <br />
              템플릿을 선택해 첫 도안을 만들어보세요.
            </p>
            <Button color="fill" className="w-[320px]">
              도안 제작하기
            </Button>
          </>
        </div>
      )}

      <div className="grid gap-x-[30px] gap-y-16 container py-3 grid-cols-3 lg:grid-cols-4 ">
        {myProjectList?.map((project) => (
          <TemplateItem key={project.id} name={project.name} id={project.id} />
        ))}
      </div>
    </div>
  );
}
function TemplateItem({ name, id }: { name: string; id: string }) {
  const queryClient = useQueryClient();

  const { mutate: deleteProjectMutation, isPending } = useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: () => {
      toast("프로젝트가 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: [projectQueryKey],
      });
    },
    onError: () => {
      toast("프로젝트 삭제에 실패했습니다.");
    },
  });

  const onDelete = () => {
    overlay.open(({ isOpen, close }) => (
      <AlertDialog
        open={isOpen}
        onOpenChange={close}
        onAction={async () => {
          await deleteProjectMutation();
          close();
        }}
        title={`‘${name}’ 프로젝트를 삭제하시겠습니까?`}
        actionText="삭제"
      />
    ));
  };

  return (
    <div>
      <Link href={ROUTE.PROJECT.EDIT(id)} className="w-full">
        <div className="bg-primary-PR100 border border-neutralAlpha-NA05 rounded-lg h-[216px] overflow-hidden flex justify-center items-center">
          {/* {template.thumbnail_url && (
          <img alt={name} className="w-full h-full object-cover" />
        )} */}
          <img
            src="/assets/logo/preview-logo.svg"
            alt="preview-logo"
            className="w-[64px] h-auto object-cover"
            width={64}
          />
        </div>{" "}
      </Link>
      <div className="flex justify-between items-center mt-[9px]">
        <p className="text-medium text-neutral-N800 truncate">{name}</p>
        <button onClick={() => onDelete()} disabled={isPending}>
          <Trash2 className="w-6 h-6 text-primary-PR" />
        </button>
      </div>
    </div>
  );
}
