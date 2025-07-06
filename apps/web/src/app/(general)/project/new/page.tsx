import { redirect } from "next/navigation";
import { Suspense } from "react";

import NewProjectClient from "./_components/client";

import Header from "@/components/layout/Header";
import { ROUTE } from "@/constants/route";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ templateId?: string; name?: string }>;
}) {
  const { templateId, name } = await searchParams;

  if (!templateId) {
    redirect(ROUTE.TEMPLATE);
  }

  return (
    <div>
      <Header />
      <div className="pt-16 px-8 mx-auto container">
        <div className="py-6 px-5 border-neutral-N200 border flex flex-col gap-8 rounded-lg justify-center items-center">
          <div className="flex flex-col gap-3 items-center">
            <div className="text-medium-sb text-neutral-N0 bg-primary-PR rounded-md py-1 px-2 w-fit">
              Project
            </div>
            <h2 className="text-neutral-N900 text-h3-m font-medium">{name}</h2>
          </div>
          <Suspense>
            <NewProjectClient
              templateId={templateId}
              templateName={name ?? ""}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
