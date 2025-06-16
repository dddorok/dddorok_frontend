"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import ChartRegistration from "../new/ChartRegistration";

import { chartTypeQueries } from "@/queries/chart-type";

export default function SvgMappingPage() {
  return (
    <div>
      <Suspense>
        <SvgMappingForm />
      </Suspense>
    </div>
  );
}

function SvgMappingForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data } = useSuspenseQuery({
    ...chartTypeQueries.svgMapping(id ?? ""),
    retry: false,
  });

  return <ChartRegistration />;
}
