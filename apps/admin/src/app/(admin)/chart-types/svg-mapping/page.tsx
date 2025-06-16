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

  const testData = {
    svg_url:
      "https://dddorok-s3.s3.amazonaws.com/public/chart-svg/766d0a72-c662-4fbd-b859-4ca26d12a811.svg",
    svg_name: "셋인형 뒷몸판.svg",
    mapped_path_id: [
      {
        code: "BODY_HEM_WIDTH",
        label: "밑단 너비",
        slider_default: false,
      },
      {
        code: "BODY_WAIST_SLOPE_LENGTH",
        label: "허리 사선 길이",
        slider_default: false,
      },
      {
        code: "BODY_BACK_ARMHOLE_CIRCUMFERENCE",
        label: "뒤진동 둘레",
        slider_default: true,
      },
      {
        code: "BODY_SHOULDER_SLOPE_WIDTH",
        label: "어깨사선 너비",
        slider_default: false,
      },
      {
        code: "BODY_BACK_NECK_CIRCUMFERENCE",
        label: "뒷목 둘레",
        slider_default: false,
      },
    ],
    manual_mapped_path_id: [
      {
        code: "BODY_WAIST_LENGTH",
        label: "허리 길이",
        slider_default: false,
      },
      {
        code: "BODY_CHEST_WIDTH",
        label: "가슴 너비",
        slider_default: false,
      },
      {
        code: "BODY_BAND_WIDTH",
        label: "몸통 고무단 너비",
        slider_default: true,
      },
      {
        code: "BODY_ARMHOLE_LENGTH",
        label: "진동 길이",
        slider_default: true,
      },
      {
        code: "BODY_SHOULDER_SLOPE_LENGTH",
        label: "어깨경사 길이",
        slider_default: true,
      },
      {
        code: "BODY_SHOULDER_WIDTH",
        label: "어깨 너비",
        slider_default: true,
      },
      {
        code: "BODY_BACK_NECK_WIDTH",
        label: "뒷목 너비",
        slider_default: true,
      },
      {
        code: "BODY_BACK_NECK_LENGTH",
        label: "뒷목 길이",
        slider_default: true,
      },
    ],
  };

  return <ChartRegistration data={testData} id={id ?? ""} />;
}
