"use client";

import { useRouter } from "next/navigation";

import InformationForm from "./information-form";

export default function NewChartTypePage() {
  const router = useRouter();

  return (
    <>
      {/* {step === 1 && ( */}
      <InformationForm
        onSubmit={(id, data) => {
          router.push(`/chart-types/svg-mapping?id=${id}`);
        }}
      />
    </>
  );
}
