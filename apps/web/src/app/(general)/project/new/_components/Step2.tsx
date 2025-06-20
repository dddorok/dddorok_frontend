import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

import { AdjustmentEditor } from "./AdjustmentEditor";
import { SliderSection } from "./korean-slider-component";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { templateQueries } from "@/queries/template";
import {
  GetTemplateChartListResponse,
  MeasurementType,
} from "@/services/template";

export default function Step2({
  chest_circumference,
  onNext,
  onPrev,
  templateId,
}: {
  onNext: () => void;
  onPrev: () => void;
  chest_circumference: number;
  templateId: string;
}) {
  const { data: template } = useSuspenseQuery({
    ...templateQueries.chartList(templateId, chest_circumference),
  });

  const measurements = template.measurements.map(
    (measurement) => measurement[1]
  );

  const onSubmit = () => {
    console.log("submit");
  };

  const bodyMeasurements = measurements.filter(
    (measurement) =>
      measurement.code.includes("BODY") && measurement.range_toggle
  );
  const sleeveMeasurements = measurements.filter(
    (measurement) =>
      measurement.code.includes("SLEEVE") && measurement.range_toggle
  );

  // if (template.chart_types.length === 0) {
  //   return (
  //     <div className="w-full h-full flex justify-center items-center gap-2">
  //       <AlertCircle className="w-6 h-6 text-primary-PR" />
  //       <p className="text-neutral-N500 text-body">차트 데이터가 없습니다.</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="w-full mx-auto p-8 bg-gray-50 min-h-screen">
        <section className="mb-8">
          <h4 className="text-[21px] font-semibold text-neutral-N500 mb-4">
            <strong className="text-neutral-N900 font-semibold">
              몸판 길이
            </strong>
            를 조정해주세요
          </h4>
          {/* <div className="grid-cols-[315px_1fr] gap-16 grid"> */}
          {/* <Svg1 /> */}
          <div className="bg-neutral-N100 border border-neutral-N200 ">
            {/* <div className="flex gap-4 mb-4 pt-4 pb-2 justify-center">
          {Object.keys(measurements).map((valueType) => (
            <button
              key={valueType}
              onClick={() => setSelectedValueType(valueType)}
              className={cn(
                "h-9 px-4 text-medium-r border-neutral-N400 border text-neutral-N500 rounded-md ",
                selectedValueType === valueType &&
                  "bg-primary-PR text-[#FFFFFF] text-medium-b border-primary-PR"
              )}
            >
              {VALUE_TYPE_LABELS[valueType as keyof typeof VALUE_TYPE_LABELS]}
            </button>
          ))}
        </div> */}
            <AdjustmentEditor measurements={bodyMeasurements} />
            <AdjustmentEditor measurements={sleeveMeasurements} />
          </div>
        </section>

        {/* <ChartSection
          measurements={bodyMeasurementsByValueType}
          label="몸판 길이"
        />
        <ChartSection
          measurements={sleeveMeasurementsByValueType}
          label="소매"
        /> */}
        <div className="max-w-[500px] mx-auto grid grid-cols-[76px_1fr] gap-6">
          <Button color="default" onClick={onPrev}>
            이전
          </Button>
          <Button color="fill" onClick={onSubmit}>
            프로젝트 만들기 →
          </Button>
        </div>
      </div>
    </div>
  );
}

const VALUE_TYPE_LABELS = {
  WIDTH: "너비",
  LENGTH: "길이",
  CIRCUMFERENCE: "둘레",
  DIAMETER: "지름",
  RADIUS: "반지름",
  AREA: "면적",
  VOLUME: "부피",
};

function ChartSection({
  measurements,
  label,
}: {
  measurements: Record<string, [string, MeasurementType][]>;
  label: string;
}) {
  return (
    <section className="mb-8">
      <h4 className="text-[21px] font-semibold text-neutral-N500 mb-4">
        <strong className="text-neutral-N900 font-semibold">몸판 길이</strong>를
        조정해주세요
      </h4>
      <div className="bg-neutral-N100 border border-neutral-N200 ">
        {/* <div className="flex gap-4 mb-4 pt-4 pb-2 justify-center">
          {Object.keys(measurements).map((valueType) => (
            <button
              key={valueType}
              onClick={() => setSelectedValueType(valueType)}
              className={cn(
                "h-9 px-4 text-medium-r border-neutral-N400 border text-neutral-N500 rounded-md ",
                selectedValueType === valueType &&
                  "bg-primary-PR text-[#FFFFFF] text-medium-b border-primary-PR"
              )}
            >
              {VALUE_TYPE_LABELS[valueType as keyof typeof VALUE_TYPE_LABELS]}
            </button>
          ))}
        </div> */}
        <AdjustmentEditor
          measurements={Object.values(measurements).flatMap((measurement) =>
            measurement.map((m) => m[1])
          )}
        />
      </div>
    </section>
  );
}
