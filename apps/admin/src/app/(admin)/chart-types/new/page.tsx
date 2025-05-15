"use client";
import { useState } from "react";

import InformationForm from "./information-form";
import SvgMappingForm from "./svg-mapping-form";

export default function NewChartTypePage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  return (
    <>
      {step === 1 && <InformationForm />}
      {step === 2 && <SvgMappingForm />}
    </>
  );
}
