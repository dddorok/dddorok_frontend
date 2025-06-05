/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import CommonLayout from "@/components/layout/MainLayout";
import { ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";
import { templateQueries } from "@/queries/template";
import { TemplateType } from "@/services/template";

const TAB = ["전체", "스웨터", "가디건", "베스트"];
export default function TemplateListPage() {
  const [activeTab, setActiveTab] = useState(TAB[0]);
  const { data: templateList } = useQuery({
    ...templateQueries.list({}),
  });

  console.log(templateList);
  return (
    <CommonLayout>
      <div className="py-16 px-8">
        <div className="flex items-center justify-between gap-4 flex-col">
          <h2 className="text-[32px] font-semibold text-neutral-1000">
            템플릿으로 뜨개 도안을 만들어보세요.
          </h2>
          <p className="text-medium-r text-[#4E4E4E]">
            도안 제작 경험이 없어도 누구나 디자인할 수 있어요.
          </p>
        </div>
      </div>
      <hr className="mb-6 w-screen absolute left-1/2 border-none -translate-x-1/2 h-[0.5px] bg-neutralAlpha-NA20" />
      <div className="py-6">
        <div className="flex items-center justify-center gap-5">
          {TAB.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-[6px] text-neutral-N500 text-medium-r rounded-[6px] border border-neutral-N400",
                activeTab === tab &&
                  "bg-primary-PR text-medium-b text-neutral-N0   border-primary-PR"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-x-3 gap-y-16 container py-12 ">
        {templateList?.items.map((template) => (
          <Link
            href={ROUTE.PROJECT.NEW(template.id, template.name)}
            key={template.id}
            className="w-full"
          >
            <TemplateItem template={template} />
          </Link>
        ))}
      </div>
    </CommonLayout>
  );
}

function TemplateItem({ template }: { template: TemplateType }) {
  return (
    <div>
      <div className="bg-primary-PR100 border border-neutralAlpha-NA05 rounded-lg h-[216px]">
        {template.thumbnail_url && (
          <img
            src={template.thumbnail_url}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <p className="text-medium text-neutral-N800 mt-[9px] truncate">
        {template.name}
      </p>
    </div>
  );
}
