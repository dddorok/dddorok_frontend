"use client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useRef, useState } from "react";

import Step1 from "./Step1";
import Step2 from "./Step2";

import { cn } from "@/lib/utils";
import { templateQueries } from "@/queries/template";

export default function NewProjectClient({
  templateId,
}: {
  templateId: string;
}) {
  const formData = useRef<{
    name: string;
    gauge_ko: number;
    gauge_dan: number;
    chest_width: number;
  }>({
    name: "",
    gauge_ko: 0,
    gauge_dan: 0,
    chest_width: 0,
  });
  const [step, setStep] = useState(1);

  const { data: template } = useSuspenseQuery({
    ...templateQueries.chartList(templateId),
  });

  if (template.chart_types.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center gap-2">
        <AlertCircle className="w-6 h-6 text-primary-PR" />
        <p className="text-neutral-N500 text-body">차트 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {step === 1 && (
        <div className=" space-y-2 w-[450px]">
          <h3 className="text-h3 text-primary-PR py-[10px] text-center">
            Step 1. 가슴둘레/게이지 입력
          </h3>
          <ProgressDot current={1} total={2} />
          <Step1
            onNext={(data) => {
              formData.current = data;
              setStep(2);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <div className="w-full">
          <h3 className="text-h3 text-primary-PR py-[10px] mb-4 text-center">
            Step 2. 가슴둘레/게이지 입력
          </h3>
          <ProgressDot current={2} total={2} />
          <div className="py-4 px-5 w-full">
            <Step2
              measurements={template.measurements}
              onNext={() => setStep(3)}
              onPrev={() => setStep(1)}
              chest_width={formData.current.chest_width}
            />
          </div>
        </div>
      )}
    </>
  );
}

export function ProgressDot({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-3 h-3 bg-neutral-N400 rounded-full",
            current === index + 1 && "bg-primary-PR"
          )}
        />
      ))}
    </div>
  );
}
