/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery } from "@tanstack/react-query";
import { Trash2, TrashIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ROUTE } from "@/constants/route";
import { projectQueries } from "@/queries/project";

export default function MyPage() {
  const { data: myProjectList } = useQuery({
    ...projectQueries.myProjectList(),
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
          <Link
            href={ROUTE.PROJECT.EDIT(project.id)}
            key={project.id}
            className="w-full"
          >
            <TemplateItem name={project.name} />
          </Link>
        ))}
      </div>
    </div>
  );
}
function TemplateItem({ name }: { name: string }) {
  return (
    <div>
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
      </div>
      <div className="flex justify-between items-center mt-[9px]">
        <p className="text-medium text-neutral-N800 truncate">{name}</p>
        <Trash2 className="w-6 h-6 text-primary-PR" />
      </div>
    </div>
  );
}
