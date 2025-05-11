"use client";
import { useState } from "react";

import InformationForm from "./information-form";
import SvgMappingForm from "./svg-mapping-form";

export default function NewChartTypePage() {
  const [step, setStep] = useState(2);

  return (
    <>
      {step === 1 && <InformationForm onNext={() => setStep(2)} />}
      {step === 2 && <SvgMappingForm />}
    </>
  );
}
