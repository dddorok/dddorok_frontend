"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import Step1 from "./Step1";
import Step2 from "./Step2";

import { ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";
import { projectQueryKey } from "@/queries/project";
import { createProject } from "@/services/project";

export default function NewProjectClient({
  templateId,
}: {
  templateId: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
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

  const onSubmit = async (
    measurements: { code: string; value: number }[],
    noControlData: { code: string; value: number }[]
  ) => {
    try {
      await createProject({
        name: formData.current.name,
        template_id: templateId,
        gauge_ko: formData.current.gauge_ko,
        gauge_dan: formData.current.gauge_dan,
        measurement_codes: [...measurements, ...noControlData].map((m) => ({
          measurement_code: m.code,
          value: m.value,
        })),
      });
      queryClient.invalidateQueries({
        queryKey: [projectQueryKey],
      });

      toast.success("프로젝트 생성 완료");

      router.push(ROUTE.MYPAGE.PROJECT());
    } catch (error) {
      console.log(error);
    }
  };

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
              templateId={templateId}
              chest_circumference={formData.current.chest_width}
              onNext={onSubmit}
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
