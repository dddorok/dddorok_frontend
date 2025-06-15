import { useState } from "react";

import { SliderSection } from "./korean-slider-component";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GetTemplateChartListResponse,
  MeasurementType,
} from "@/services/template";

export default function Step2({
  measurements,
  chest_width,
  onNext,
  onPrev,
}: {
  measurements: GetTemplateChartListResponse["measurements"];
  onNext: () => void;
  onPrev: () => void;
  chest_width: number;
}) {
  const onSubmit = () => {
    console.log("submit");
  };

  const bodyMeasurements = measurements.filter((measurement) =>
    measurement[1].code.includes("BODY")
  );
  const sleeveMeasurements = measurements.filter((measurement) =>
    measurement[1].code.includes("SLEEVE")
  );

  const bodyMeasurementsByValueType = bodyMeasurements.reduce(
    (acc, measurement) => {
      const valueType = measurement[1].value_type;
      if (!acc[valueType]) {
        acc[valueType] = [];
      }
      acc[valueType].push(measurement);
      return acc;
    },
    {} as Record<string, GetTemplateChartListResponse["measurements"][number][]>
  );

  const sleeveMeasurementsByValueType = sleeveMeasurements.reduce(
    (acc, measurement) => {
      const valueType = measurement[1].value_type;
      if (!acc[valueType]) {
        acc[valueType] = [];
      }
      acc[valueType].push(measurement);
      return acc;
    },
    {} as Record<string, GetTemplateChartListResponse["measurements"][number][]>
  );

  return (
    <div>
      <div className="w-full mx-auto p-8 bg-gray-50 min-h-screen">
        <ChartSection
          measurements={bodyMeasurementsByValueType}
          label="몸판 길이"
        />
        <ChartSection
          measurements={sleeveMeasurementsByValueType}
          label="소매"
        />
        <div className="max-w-[500px] mx-auto grid grid-cols-[76px_1fr] gap-6">
          <Button color="default" onClick={onPrev}>
            이전
          </Button>
          <Button color="fill" onClick={onSubmit}>
            프로젝트 만들기 →
          </Button>
        </div>
      </div>
    </div>
  );
}

const VALUE_TYPE_LABELS = {
  WIDTH: "너비",
  LENGTH: "길이",
  CIRCUMFERENCE: "둘레",
  DIAMETER: "지름",
  RADIUS: "반지름",
  AREA: "면적",
  VOLUME: "부피",
};

function ChartSection({
  measurements,
  label,
}: {
  measurements: Record<string, MeasurementType[]>;
  label: string;
}) {
  const [selectedValueType, setSelectedValueType] = useState<string>(
    Object.keys(measurements)[0] ?? ""
  );

  const selectedMeasurements = measurements[selectedValueType] ?? [];

  return (
    <section className="mb-8">
      <h4 className="text-[21px] font-semibold text-neutral-N500 mb-4">
        <strong className="text-neutral-N900 font-semibold">{label}</strong>를
        조정해주세요
      </h4>
      <div className="grid-cols-[315px_1fr] gap-16 grid">
        <Svg1 />
        <div className="bg-neutral-N100 border border-neutral-N200 ">
          <div className="flex gap-4 mb-4 pt-4 pb-2 justify-center">
            {Object.keys(measurements).map((valueType) => (
              <button
                key={valueType}
                onClick={() => setSelectedValueType(valueType)}
                className={cn(
                  "h-9 px-4 text-medium-r border-neutral-N400 border text-neutral-N500 rounded-md ",
                  selectedValueType === valueType &&
                    "bg-primary-PR text-[#FFFFFF] text-medium-b border-primary-PR"
                )}
              >
                {VALUE_TYPE_LABELS[valueType as keyof typeof VALUE_TYPE_LABELS]}
              </button>
            ))}
          </div>
          <div className="rounded-sm px-[18px] py-4 space-y-[72px]">
            {selectedMeasurements.map(([key, measurement]) => (
              <SliderSection
                key={key}
                label={measurement.label}
                min={measurement.min}
                max={measurement.max}
                snapValues={getSnapValues(measurement.min, measurement.max)}
                initialValue={measurement.value}
                average={measurement.min}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const getSnapValues = (min: number, max: number) => {
  const values = [];
  for (let i = min; i <= max; i++) {
    values.push(i);
  }
  return values;
};

function Svg1() {
  return (
    <svg
      width="317"
      height="673"
      viewBox="0 0 317 673"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.7002 0.5H308.301C312.443 0.5 315.801 3.85786 315.801 8V664.135C315.801 668.277 312.443 671.635 308.301 671.635H8.7002C4.55812 671.635 1.20029 668.277 1.2002 664.135V8C1.2002 3.85787 4.55806 0.5 8.7002 0.5Z"
        stroke="#D2D5E2"
      />
      <path
        d="M126.546 45.0674L75.7937 57.7994V122.187C75.7937 137.466 58.5005 140.012 58.5005 140.012V288.067H258.5V140.012C258.5 140.012 241.207 137.466 241.207 122.187V57.7994L190.455 45.0674C190.455 45.0674 186.696 63.6198 177.673 69.0764C170.342 73.5101 158.5 73.201 158.5 73.201C158.5 73.201 146.659 73.5101 139.328 69.0764C130.305 63.6198 126.546 45.0674 126.546 45.0674Z"
        fill="#F5F7FA"
      />
      <path
        d="M58.5005 270.136H258.5M75.7937 57.7994L126.546 45.0674C126.546 45.0674 130.305 63.6198 139.328 69.0764C146.659 73.5101 158.5 73.201 158.5 73.201C158.5 73.201 170.342 73.5101 177.673 69.0764C186.696 63.6198 190.455 45.0674 190.455 45.0674L241.207 57.7994V122.187C241.207 137.466 258.5 140.012 258.5 140.012V288.067H58.5005V140.012C58.5005 140.012 75.7937 137.466 75.7937 122.187V57.7994Z"
        stroke="#1C1F25"
        strokeOpacity="0.4"
      />
      <path
        d="M149.18 301.458V304.864H151.274V305.864H149.18V309.333H147.961V301.458H149.18ZM138.586 305.521C138.579 303.583 140.125 302.255 142.227 302.255C144.344 302.255 145.868 303.583 145.883 305.521C145.868 307.435 144.344 308.755 142.227 308.755C140.125 308.755 138.579 307.435 138.586 305.521ZM139.79 305.521C139.782 306.817 140.821 307.724 142.227 307.739C143.649 307.724 144.672 306.817 144.68 305.521C144.672 304.2 143.649 303.286 142.227 303.286C140.821 303.286 139.782 304.2 139.79 305.521ZM140.149 315.114V314.114H142.243V311.067H140.274V310.067H149.555V311.067H147.602V314.114H149.727V315.114H140.149ZM143.43 314.114H146.415V311.067H143.43V314.114ZM163.258 310.583V315.146H153.696V310.583H163.258ZM152.149 309.208V308.192H157.868V306.614H153.79V301.958H163.196V306.614H159.086V308.192H164.805V309.208H152.149ZM154.915 314.146H162.055V311.567H154.915V314.146ZM154.993 305.614H161.977V302.958H154.993V305.614ZM173.915 302.771V303.771H172.493V308.372C173.204 308.325 173.907 308.255 174.571 308.177L174.665 309.099C171.844 309.536 168.579 309.606 166.165 309.599L166.024 308.583C166.586 308.583 167.188 308.575 167.821 308.56V303.771H166.415V302.771H173.915ZM168.149 315.036V310.708H169.352V314.005H177.477V315.036H168.149ZM169.024 308.536C169.766 308.521 170.532 308.489 171.29 308.45V303.771H169.024V308.536ZM175.618 311.677V301.458H176.836V305.677H178.93V306.724H176.836V311.677H175.618Z"
        fill="#9EA5BD"
      />
      <path
        d="M126.546 352.067L75.7937 364.799V420.457C75.7937 435.735 58.5005 447.012 58.5005 447.012V595.067H258.5V447.012C258.5 447.012 241.207 435.735 241.207 420.457V364.799L190.455 352.067C190.455 352.067 186.696 359.343 180.681 359.343H136.32C130.305 359.343 126.546 352.067 126.546 352.067Z"
        fill="#F5F7FA"
      />
      <path
        d="M59.1353 578.373L258.496 577.108M75.7937 364.799L126.546 352.067C126.546 352.067 130.305 359.343 136.32 359.343H180.681C186.696 359.343 190.455 352.067 190.455 352.067L241.207 364.799V420.457C241.207 435.735 258.5 447.012 258.5 447.012V595.067H58.5005V447.012C58.5005 447.012 75.7937 435.735 75.7937 420.457V364.799Z"
        stroke="#9EA5BD"
      />
      <path
        d="M146.368 612.489V613.505H139.743V609.146H146.336V610.161H140.961V612.489H146.368ZM138.368 614.864C141.071 614.88 144.485 614.849 147.493 614.552L147.571 615.458C146.18 615.63 144.735 615.739 143.321 615.802V618.239H142.118V615.849C140.852 615.888 139.641 615.896 138.555 615.896L138.368 614.864ZM140.165 621.317C142.657 620.966 144.852 619.685 144.868 617.927V617.317H146.086V617.927C146.079 619.685 148.266 620.966 150.774 621.317L150.29 622.255C148.196 621.942 146.297 621.013 145.469 619.567C144.625 621.021 142.719 621.95 140.618 622.271L140.165 621.317ZM148.477 618.489V608.442H149.696V618.489H148.477ZM163.258 617.583V622.146H153.696V617.583H163.258ZM152.149 616.208V615.192H157.868V613.614H153.79V608.958H163.196V613.614H159.086V615.192H164.805V616.208H152.149ZM154.915 621.146H162.055V618.567H154.915V621.146ZM154.993 612.614H161.977V609.958H154.993V612.614ZM173.915 609.771V610.771H172.493V615.372C173.204 615.325 173.907 615.255 174.571 615.177L174.665 616.099C171.844 616.536 168.579 616.606 166.165 616.599L166.024 615.583C166.586 615.583 167.188 615.575 167.821 615.56V610.771H166.415V609.771H173.915ZM168.149 622.036V617.708H169.352V621.005H177.477V622.036H168.149ZM169.024 615.536C169.766 615.521 170.532 615.489 171.29 615.45V610.771H169.024V615.536ZM175.618 618.677V608.458H176.836V612.677H178.93V613.724H176.836V618.677H175.618Z"
        fill="#9EA5BD"
      />
    </svg>
  );
}
