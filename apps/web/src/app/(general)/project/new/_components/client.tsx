"use client";
import { isEmpty } from "@dddorok/utils";
import { useRef, useState } from "react";

import { AdjustmentEditor } from "./AdjustmentEditor";
import Step1 from "./Step1";
import Step2 from "./Step2";

import { cn } from "@/lib/utils";

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
  const [step, setStep] = useState(2);

  return (
    <>
      {/* <AdjustmentEditor /> */}
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
              templateId={templateId}
              chest_circumference={formData.current.chest_width}
              onNext={() => setStep(3)}
              onPrev={() => setStep(1)}
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
