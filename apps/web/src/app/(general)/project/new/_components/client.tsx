"use client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

import Step1 from "./Step1";
import Step2 from "./Step2";

import { Progress } from "@/components/ui/progress";
import { templateQueries } from "@/queries/template";

export default function NewProjectClient({
  templateId,
}: {
  templateId: string;
}) {
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
        <div className="w-[450px]">
          <h3 className="text-h3 text-primary-PR py-[10px] mb-4">
            Step 1. 가슴둘레/게이지 입력
          </h3>
          <Progress value={33} className="w-full" />
          <Step1 onNext={() => setStep(2)} />
        </div>
      )}
      {step === 2 && (
        <div className="w-full">
          <h3 className="text-h3 text-primary-PR py-[10px] mb-4 text-center">
            Step 2. 가슴둘레/게이지 입력
          </h3>
          <Progress value={66} className="max-w-[450px] mx-auto" />
          <div className="py-6 px-5 w-full">
            <Step2 chartTypes={template.chart_types} />
          </div>
        </div>
      )}
    </>
  );
}
