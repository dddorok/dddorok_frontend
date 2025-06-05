/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { CarouselSpacing } from "./_components/Slider";

import Header from "@/components/layout/Header";
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
      <div className="pt-16 px-8 pb-12">
        <div className="flex items-center justify-between gap-4 flex-col">
          <h2 className="text-[32px] font-semibold text-neutral-1000">
            템플릿으로 뜨개 도안을 만들어보세요.
          </h2>
          <p className="text-medium-r text-[#4E4E4E]">
            도안 제작 경험이 없어도 누구나 디자인할 수 있어요.
          </p>
        </div>
      </div>
      <div className="mt-1 border-t border-[0.5px] border-neutralAlpha-NA20 py-6">
        <div className="flex items-center justify-center gap-5">
          {TAB.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-h3 px-5 py-3 text-primary-PR text-[24px] font-semibold",
                activeTab === tab && "bg-primary-PR text-neutral-N0 rounded-xl"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[30px] container pt-12 px-8">
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
      {/* <div className="container pt-12">
        <CarouselSpacing />
      </div> */}
    </CommonLayout>
  );
}

function TemplateItem({ template }: { template: TemplateType }) {
  return (
    <div>
      <div className="bg-neutral-N200 h-[200px]">
        {template.thumbnail_url && (
          <img
            src={template.thumbnail_url}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <p className="text-[21px] text-neutral-N800 font-medium py-2 truncate">
        {template.name}
      </p>
    </div>
  );
}
