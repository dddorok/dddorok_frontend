"use client";
import { useState } from "react";

import { GROUPPING_MEASUREMENT } from "./constants";
import InformationForm from "./information-form";
import SvgMappingForm from "./svg-mapping-form";

export default function NewChartTypePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any | null>(null);

  const measurementList = formData?.type
    ? formData?.type === "몸판"
      ? GROUPPING_MEASUREMENT["몸통"]
      : GROUPPING_MEASUREMENT["소매"]
    : [];

  return (
    <>
      {step === 1 && (
        <InformationForm
          onSubmit={(data) => {
            setFormData(data);
            setStep(2);
          }}
        />
      )}

      {step === 2 && <SvgMappingForm measurementList={measurementList ?? []} />}
    </>
  );
}
