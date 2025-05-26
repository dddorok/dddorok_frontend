import React, { useRef, useState } from "react";

import { cn } from "@/lib/utils";

const useSlider = ({
  initialValue,
  min,
  max,
  snapValues,
}: {
  initialValue: number;
  min: number;
  max: number;
  snapValues: number[];
}) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const findClosestValue = React.useCallback(
    (targetValue: number): number => {
      return snapValues.reduce((prev, curr) => {
        return Math.abs(curr - targetValue) < Math.abs(prev - targetValue)
          ? curr
          : prev;
      });
    },
    [snapValues]
  );

  const calculateValueFromClientX = React.useCallback(
    (clientX: number): number => {
      if (!sliderRef.current) return value;

      const rect = sliderRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const newPercentage = Math.max(
        0,
        Math.min(100, (clickX / rect.width) * 100)
      );
      return min + (newPercentage / 100) * (max - min);
    },
    [min, max, value]
  );

  const updateValue = React.useCallback(
    (clientX: number) => {
      const newValue = calculateValueFromClientX(clientX);

      if (isDragging) {
        // 드래그 중에는 자유롭게 움직임
        setValue(newValue);
      } else {
        // 클릭 시에만 snapValue로 스냅
        const closestValue = findClosestValue(newValue);
        setValue(closestValue);
      }
    },
    [isDragging, calculateValueFromClientX, findClosestValue]
  );

  const handleTrackClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        e.target === e.currentTarget ||
        (e.target as HTMLElement).classList.contains("slider-track")
      ) {
        updateValue(e.clientX);
      }
    },
    [updateValue]
  );

  const handleThumbMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      console.log("handleThumbMouseDown");
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      updateValue(e.clientX);
    },
    [updateValue]
  );

  // 마우스 이벤트 리스너 설정
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        const closestValue = findClosestValue(value);
        setValue(closestValue);
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, value, findClosestValue, updateValue]);

  const generateTicks = React.useCallback(() => {
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
  }, [snapValues, min, max]);

  return {
    value,
    isDragging,
    handleTrackClick,
    handleThumbMouseDown,
    sliderRef,
    percentage,
    generateTicks,
  };
};

export const SliderSection = ({
  label,
  min,
  max,
  snapValues,
  initialValue,
  leftLabel,
  rightLabel,
  average,
}: {
  label: string;
  min: number;
  max: number;
  snapValues: number[];
  initialValue: number;
  leftLabel?: string;
  rightLabel?: string;
  average: number;
}) => {
  const {
    value,
    isDragging,
    handleTrackClick,
    handleThumbMouseDown,
    sliderRef,
    percentage,
    generateTicks,
  } = useSlider({
    initialValue,
    min,
    max,
    snapValues,
  });

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
        {/* 현재 값 표시 (슬라이더 위에) */}
        <div className="relative mb-2">
          <div
            className={cn(
              "absolute transform -translate-x-1/2  px-[6px] py-[2px] rounded text-sm font-medium top-[-38px]",
              "rounded-sm bg-primary-PR shadow-md text-neutral-N0",
              isDragging ? "bg-[#4581DB] border-[#4581DB]" : "bg-primary-PR"
            )}
            style={{ left: `${percentage}%` }}
          >
            {Math.round(value)}
          </div>
          <div
            className="absolute transform -translate-x-1/2 top-[-28px]"
            style={{ left: `${percentage}%` }}
          >
            <Dots />
          </div>
        </div>

        {/* 슬라이더 */}
        <div ref={sliderRef} className={cn(`relative h-6 cursor-pointer`)}>
          <div
            className="h-16 relative top-[-10px] z-[20] cursor-grab"
            onClick={handleTrackClick}
            onMouseDown={handleThumbMouseDown}
          ></div>
          <div className="slider-track absolute top-1/2 transform -translate-y-1/2 w-full h-[1px] bg-neutral-N500 rounded-full"></div>
          <div
            className={cn(
              `absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-primary-PR shadow-lg `,
              isDragging
                ? "bg-[#4581DB] border-[#4581DB] cursor-grabbing"
                : "bg-primary-PR",
              "z-10"
            )}
            style={{ left: `${percentage}%` }}
          ></div>
        </div>

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
