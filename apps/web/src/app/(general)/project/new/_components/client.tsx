"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import Step1 from "./Step1";
import { FormData } from "./Step1";
import Step2 from "./Step2";

import { ROUTE } from "@/constants/route";
import { cn } from "@/lib/utils";
import { projectQueryKey } from "@/queries/project";
import { createProject } from "@/services/project";

export default function NewProjectClient({
  templateId,
  templateName,
}: {
  templateId: string;
  templateName: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const formData = useRef<FormData>({
    name: "",
    gauge_ko: 0,
    gauge_dan: 0,
    chest_width: 0,
    gauge_tab: "gauge_manual",
  });
  const [step, setStep] = useState(1);

  const onSubmit = async (
    measurements: { code: string; value: number }[],
    noControlData: { code: string; value: number }[]
  ) => {
    try {
      const res = await createProject({
        name: formData.current.name,
        template_id: templateId,
        gauge_ko: formData.current.gauge_ko,
        gauge_dan: formData.current.gauge_dan,
        measurement_codes: [...measurements, ...noControlData].map((m) => ({
          measurement_code: m.code,
          value: m.value,
        })),
        is_temporary: formData.current.gauge_tab === "gauge_after",
      });
      await queryClient.invalidateQueries({
        queryKey: [projectQueryKey],
      });

      toast.success("프로젝트 생성 완료");

      // await router.push(ROUTE.MYPAGE.PROJECT());
      router.push(ROUTE.PROJECT.EDIT(res.data.id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {step === 1 && (
        <div className="space-y-2 w-[450px]">
          <Guide
            title="측정 가이드"
            list={[
              { title: "가슴둘레 측정 방법", onClick: () => {} },
              { title: "게이지 측정 방법", onClick: () => {} },
            ]}
          />
          <h3 className="text-h3 text-primary-PR py-[10px] text-center">
            Step 1. 가슴둘레/게이지 입력
          </h3>
          <ProgressDot current={1} total={2} />
          <Step1
            templateName={templateName}
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
            Step 2. 세부 치수 조정
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

function Guide(props: {
  list: {
    title: string;
    onClick: () => void;
  }[];
  title: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 border-primary-PR300 border rounded-md">
      <h3 className="text-neutral-N900 mb-2 text-large font-semibold text-left">
        {props.title}
      </h3>
      {props.list.map((item) => (
        <button
          key={item.title}
          onClick={item.onClick}
          className="text-neutral-N900 text-list font-medium text-left"
        >
          👉🏼 {item.title}
        </button>
      ))}
    </div>
  );
}
