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

  const measurements = template.measurements;

  const onSubmit = () => {
    console.log("submit");
  };

  const bodyMeasurements = measurements.filter((measurement) =>
    measurement[1].code.includes("BODY")
  );
  const sleeveMeasurements = measurements.filter((measurement) =>
    measurement[1].code.includes("SLEEVE")
  );

  const bodyMeasurementsByValueType = bodyMeasurements.reduce(
    (acc, measurement) => {
      const valueType = measurement[1].value_type;
      if (!acc[valueType]) {
        acc[valueType] = [];
      }
      acc[valueType].push(measurement);
      return acc;
    },
    {} as Record<string, GetTemplateChartListResponse["measurements"][number][]>
  );

  const sleeveMeasurementsByValueType = sleeveMeasurements.reduce(
    (acc, measurement) => {
      const valueType = measurement[1].value_type;
      if (!acc[valueType]) {
        acc[valueType] = [];
      }
      acc[valueType].push(measurement);
      return acc;
    },
    {} as Record<string, GetTemplateChartListResponse["measurements"][number][]>
  );

  if (template.chart_types.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center gap-2">
        <AlertCircle className="w-6 h-6 text-primary-PR" />
        <p className="text-neutral-N500 text-body">차트 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full mx-auto p-8 bg-gray-50 min-h-screen">
        <ChartSection
          measurements={bodyMeasurementsByValueType}
          label="몸판 길이"
          svgContent={BODY_SVG_CONTENT}
        />
        <ChartSection
          measurements={sleeveMeasurementsByValueType}
          label="소매"
          svgContent={SLEEVE_SVG_CONTENT}
        />
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
function ChartSection({
  measurements,
  label,
  svgContent,
}: {
  measurements: Record<string, MeasurementType[]>;
  label: string;
  svgContent: string;
}) {
  return (
    <section className="mb-8">
      <h4 className="text-[21px] font-semibold text-neutral-N500 mb-4">
        <strong className="text-neutral-N900 font-semibold">{label}</strong>를
        조정해주세요
      </h4>
      <div className="bg-neutral-N100 border border-neutral-N200 ">
        <AdjustmentEditor svgContent={svgContent} />
      </div>
    </section>
  );
}

const BODY_SVG_CONTENT = `<svg width="123" height="263" viewBox="0 0 123 263" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="&#235;&#157;&#188;&#236;&#154;&#180;&#235;&#147;&#156;&#235;&#132;&#165; &#236;&#133;&#139;&#236;&#157;&#184;&#237;&#152;&#149; &#236;&#149;&#158;&#235;&#170;&#184;&#237;&#140;&#144;">
<path id="BODY_SHOULDER_SLOPE_WIDTH" d="M86 15L46 3" stroke="black"/>
<path id="BODY_FRONT_NECK_CIRCUMFERENCE" d="M46 3C44.5 33.5 33.5 50 5 50" stroke="black"/>
<path id="BODY_HEM_WIDTH" d="M5 259H120" stroke="black"/>
<path id="BODY_WAIST_SLOPE_LENGTH" d="M120 259L120 111" stroke="black"/>
<path id="BODY_FRONT_ARMHOLE_CIRCUMFERENCE" d="M120 111C120 111 108.698 111.1 98.8756 104.64C86.5 96.5 86 79.5 86 79.5L86 15" stroke="black"/>
</g>
</svg>`;

const SLEEVE_SVG_CONTENT = `<svg width="88" height="260" viewBox="0 0 88 260" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="&#236;&#133;&#139;&#236;&#157;&#184;&#237;&#152;&#149; &#236;&#134;&#140;&#235;&#167;&#164;">
<path id="SLEEVE_HEM_WIDTH" d="M5 259H57" stroke="black"/>
<path id="SLEEVE_SLEEVE_CAP_WIDTH" d="M5 4C13.6667 4 15.8333 4 18 4" stroke="black"/>
<path id="SLEEVE_ARMHOLE_CIRCUMFERENCE" d="M85 67C69.5 66 61.7116 55.999 56.5 44.5C45.3823 22.1891 31 7 18 4" stroke="black"/>
<path id="SLEEVE_SLOPE_LENGTH" d="M85 67L57 259" stroke="black"/>
</g>
</svg>
`;
