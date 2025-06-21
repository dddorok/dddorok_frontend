import { numToAlpha, Point } from "@dddorok/utils";
import { useState, useEffect } from "react";

import { getAdjustedPoints } from "../_utils/adjustedPoints";
import { extractUniqueCoordinates } from "../_utils/extractUniqueCoordinates";
import { GridAdjustments, OriginalGridSpacing } from "../types";

export const useAdjuestment = ({
  gridPoints,
  sliderData,
}: {
  gridPoints: Point[];
  sliderData: any[];
}) => {
  const { xs, ys } = extractUniqueCoordinates(gridPoints);
  const originalGridSpacing = calculateOriginalSpacing(xs, ys);

  const [gridAdjustments, setGridAdjustments] = useState<GridAdjustments>(
    sliderData.reduce((acc, slider) => {
      acc[slider.control] = slider.initialValue;
      return acc;
    }, {} as GridAdjustments)
  );
  const [adjustedPoints, setAdjustedPoints] = useState<Point[]>([]);

  const calculateAdjustedPoints = (): Point[] => {
    if (
      gridPoints.length === 0 ||
      Object.keys(originalGridSpacing).length === 0
    )
      return [];

    const points = getAdjustedPoints(
      gridPoints,
      gridAdjustments,
      originalGridSpacing
    );

    return points;
  };

  const handleGridAdjustment = (gridKey: string, value: string): void => {
    setGridAdjustments((prev) => ({ ...prev, [gridKey]: parseFloat(value) }));
  };

  const resetAdjustments = (): void => {
    const resetObj: GridAdjustments = {};
    Object.keys(originalGridSpacing).forEach((key: string) => {
      resetObj[key] = 1;
    });
    setGridAdjustments(resetObj);
  };

  useEffect(() => {
    const points = calculateAdjustedPoints();
    setAdjustedPoints(points);
  }, [gridPoints, gridAdjustments]);

  return {
    gridAdjustments,
    handleGridAdjustment,
    originalGridSpacing,
    resetAdjustments,
    adjustedPoints,
  };
};

// 원본 그리드 간격 계산
const calculateOriginalSpacing = (
  xs: number[],
  ys: number[]
): OriginalGridSpacing => {
  const spacing: OriginalGridSpacing = {};

  // 행 간격 (세로) 계산
  for (let i = 0; i < ys.length - 1; i++) {
    const rowKey = `${numToAlpha(i)}-${numToAlpha(i + 1)}`;
    spacing[rowKey] = (ys[i + 1] || 0) - (ys[i] || 0);
  }

  // 열 간격 (가로) 계산
  for (let i = 0; i < xs.length - 1; i++) {
    const colKey = `${i + 1}-${i + 2}`;
    spacing[colKey] = (xs[i + 1] || 0) - (xs[i] || 0);
  }

  return spacing;
};

// 기본 조정값 생성
const createDefaultAdjustments = (
  xs: number[],
  ys: number[]
): GridAdjustments => {
  const adjustments: GridAdjustments = {};

  // 행 조정값 초기화
  for (let i = 0; i < ys.length - 1; i++) {
    const rowKey = `${numToAlpha(i)}-${numToAlpha(i + 1)}`;
    adjustments[rowKey] = 1;
  }

  // 열 조정값 초기화
  for (let i = 0; i < xs.length - 1; i++) {
    const colKey = `${i + 1}-${i + 2}`;
    adjustments[colKey] = 1;
  }

  return adjustments;
};
