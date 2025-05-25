import React, { useState } from "react";

import { cn } from "@/lib/utils";

// shadcn ui 스타일 Slider 컴포넌트
const Slider = ({
  value,
  onValueChange,
  min,
  max,
  snapValues,
  className = "",
}: {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  snapValues: number[];
  className?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const newPercentage = Math.max(
      0,
      Math.min(100, (clickX / rect.width) * 100)
    );
    const newValue = min + (newPercentage / 100) * (max - min);

    // 가장 가까운 snapValue로 스냅
    let closestValue = snapValues[0];

    if (!closestValue) return;
    let minDistance = Math.abs(newValue - closestValue);

    for (const snapValue of snapValues) {
      const distance = Math.abs(newValue - snapValue);
      if (distance < minDistance) {
        minDistance = distance;
        closestValue = snapValue;
      }
    }

    onValueChange(closestValue);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).classList.contains("slider-track")
    ) {
      updateValue(e.clientX);
    }
  };

  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div ref={sliderRef} className={`relative h-6 cursor-pointer ${className}`}>
      <div
        className="h-16 relative top-[-10px] z-[20]"
        onClick={handleTrackClick}
      ></div>
      {/* 슬라이더 트랙 */}
      <div className="slider-track absolute top-1/2 transform -translate-y-1/2 w-full h-[1px] bg-neutral-N500 rounded-full"></div>

      {/* 슬라이더 썸 (원) */}
      <div
        className={cn(
          `absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-primary-PR shadow-lg transition-all duration-150 cursor-grab`,
          isDragging
            ? "bg-[#4581DB] border-[#4581DB] cursor-grabbing"
            : "bg-primary-PR",
          "z-10"
        )}
        style={{ left: `${percentage}%` }}
        onMouseDown={handleThumbMouseDown}
      ></div>
    </div>
  );
};

// 개별 슬라이더 섹션 컴포넌트
const SliderSection = ({
  label,
  min,
  max,
  snapValues,
  initialValue,
  leftLabel,
  rightLabel,
}: {
  label: string;
  min: number;
  max: number;
  snapValues: number[];
  initialValue: number;
  leftLabel?: string;
  rightLabel?: string;
}) => {
  const [value, setValue] = useState(initialValue);

  // 눈금과 숫자 생성 (snapValues 기반)
  const generateTicks = () => {
    return snapValues.map((tickValue, index) => {
      const percentage = ((tickValue - min) / (max - min)) * 100;
      return (
        <div
          key={index}
          className="absolute"
          style={{ left: `${percentage}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-px h-3 bg-neutral-N500 mx-auto"></div>
          <span className="text-xs text-neutral-N500 mt-1 block text-center">
            {tickValue}
          </span>
        </div>
      );
    });
  };

  // 현재 값의 위치 계산
  const valuePercentage = ((value - min) / (max - min)) * 100;

  const average = 16;
  const averagePercentage = ((average - min) / (max - min)) * 100;

  return (
    <div className="mb-16">
      {/* 라벨 */}
      <div className="flex items-center mb-4">
        <span className="text-[14px] font-semibold text-neutral-N900">
          {label}
        </span>
      </div>

      <div className="relative">
        {/* 눈금과 숫자 */}

        {/* 현재 값 표시 (슬라이더 위에) */}
        <div className="relative mb-2">
          <div
            className={cn(
              "absolute transform -translate-x-1/2  px-[6px] py-[2px] rounded text-sm font-medium top-[-38px]",
              "rounded-sm bg-primary-PR shadow-md text-neutral-N0"
            )}
            style={{ left: `${valuePercentage}%` }}
          >
            {value}
          </div>
          <div
            className="absolute transform -translate-x-1/2 top-[-28px]"
            style={{ left: `${valuePercentage}%` }}
          >
            <Dots />
          </div>
        </div>

        {/* 슬라이더 */}
        <Slider
          value={value}
          onValueChange={setValue}
          min={min}
          max={max}
          snapValues={snapValues}
        />
        <div className="relative top-[-18px] h-[14px]">{generateTicks()}</div>

        <div className="relative mt-[6px]">
          <div
            className={cn(
              "absolute transform -translate-x-1/2",
              "bg-primary-PR200 text-primary-PR px-2 leading-[18px] rounded-sm text-[12px] font-bold"
            )}
            style={{ left: `${averagePercentage}%` }}
          >
            평균 {average}
          </div>
        </div>

        {/* 왼쪽/오른쪽 라벨 */}
        {(leftLabel || rightLabel) && (
          <div className="flex justify-between text-sm text-gray-500 px-1">
            <span>{leftLabel}</span>
            <span>{rightLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 메인 컴포넌트
const SliderApp = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <SliderSection
          label="E 소매길이"
          min={45}
          max={55}
          snapValues={[45, 47, 50, 52, 55]}
          initialValue={50}
        />

        <SliderSection
          label="F 소매너비"
          min={15}
          max={19}
          snapValues={[15, 16, 17, 18, 19]}
          initialValue={17}
        />

        <SliderSection
          label="G 손목너비"
          min={6}
          max={10}
          snapValues={[6, 7, 8, 9, 10]}
          initialValue={7}
          leftLabel="짧음"
          rightLabel="여유있음"
        />
      </div>
    </div>
  );
};

export default SliderApp;

function Dots() {
  return (
    <svg
      width="35"
      height="51"
      viewBox="0 0 35 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_7_3756)">
        <path
          d="M18.3008 14.5L16.7012 14.5L16.7012 14L18.3008 14L18.3008 14.5ZM18.3008 16.5L16.7012 16.5L16.7012 15.5L18.3008 15.5L18.3008 16.5ZM18.3008 18.5L16.7012 18.5L16.7012 17.5L18.3008 17.5L18.3008 18.5ZM18.3008 20.5L16.7012 20.5L16.7012 19.5L18.3008 19.5L18.3008 20.5ZM18.3008 22.5L16.7012 22.5L16.7012 21.5L18.3008 21.5L18.3008 22.5ZM18.3008 24.5L16.7012 24.5L16.7012 23.5L18.3008 23.5L18.3008 24.5ZM18.3008 26.5L16.7012 26.5L16.7012 25.5L18.3008 25.5L18.3008 26.5ZM18.3008 28.5L16.7012 28.5L16.7012 27.5L18.3008 27.5L18.3008 28.5ZM18.3008 30.5L16.7012 30.5L16.7012 29.5L18.3008 29.5L18.3008 30.5ZM18.3008 32.5L16.7012 32.5L16.7012 31.5L18.3008 31.5L18.3008 32.5Z"
          fill="#75C0EF"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_7_3756"
          x="0.701172"
          y="0"
          width="33.5996"
          height="50.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="8" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.823529 0 0 0 0 0.835294 0 0 0 0 0.886275 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_7_3756"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_7_3756"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
