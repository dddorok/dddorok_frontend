"use client";

import { useState } from "react";

import Step1 from "./_components/Step1";
import Step2 from "./_components/Step2";

import Header from "@/components/layout/Header";
import { Progress } from "@/components/ui/progress";

export default function NewProjectPage() {
  const [step, setStep] = useState(2);
  return (
    <div>
      <Header />
      <div className="pt-16 px-8 mx-auto container">
        <div className="py-6 px-5 border-neutral-N200 border flex flex-col gap-8 rounded-lg justify-center items-center">
          <div className="flex flex-col gap-3 items-center">
            <div className="text-medium-sb text-neutral-N0 bg-primary-PR rounded-md py-1 px-2 w-fit">
              Project
            </div>
            <h2 className="text-neutral-N900 text-h3-m font-medium  ">
              바텀업 라운드넥 셋인 슬리브 스웨터
            </h2>
          </div>
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
                <Step2 />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
