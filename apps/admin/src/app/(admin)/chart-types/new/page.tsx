"use client";
import { useState } from "react";

import InformationForm from "./information-form";
import SvgMappingForm from "./svg-mapping-form";

export default function NewChartTypePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any | null>(null);

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
      {step === 2 && <SvgMappingForm />}
    </>
  );
}
