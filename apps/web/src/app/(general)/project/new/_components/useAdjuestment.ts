import { numToAlpha, Point } from "@dddorok/utils";
import { useState, useEffect, useMemo } from "react";

import { getAdjustedPoints } from "../_utils/adjustedPoints";
import { GridAdjustments } from "../types";

export const useAdjuestment = ({
  gridPoints,
  sliderData,
}: {
  gridPoints: Point[];
  sliderData: any[];
}) => {
  const [gridAdjustments, setGridAdjustments] = useState<GridAdjustments>(
    sliderData.reduce((acc, slider) => {
      acc[slider.control] = slider.initialValue / slider.average;
      return acc;
    }, {} as GridAdjustments)
  );
  console.log("gridAdjustments: ", gridAdjustments);
  // const [adjustedPoints, setAdjustedPoints] = useState<Point[]>([]);

  const controls = sliderData.map((slider) => slider.control);

  const adjustedPoints = useMemo(() => {
    if (gridPoints.length === 0) return [];
    return getAdjustedPoints(gridPoints, gridAdjustments, controls);
  }, [gridPoints, gridAdjustments, controls]);

  const handleGridAdjustment = (gridKey: string, value: string): void => {
    const slider = sliderData.find((s) => s.control === gridKey);
    const average = slider?.average ?? 1;
    setGridAdjustments((prev) => ({
      ...prev,
      [gridKey]: parseFloat(value) / average,
    }));
  };

  const resetAdjustments = (): void => {
    const resetObj: GridAdjustments = {};
    sliderData.forEach((slider) => {
      resetObj[slider.control] = 1;
    });
    setGridAdjustments(resetObj);
  };

  // useEffect(() => {
  //   const points = calculateAdjustedPoints();
  //   setAdjustedPoints(points);
  // }, [gridPoints, gridAdjustments]);

  return {
    gridAdjustments,
    handleGridAdjustment,
    resetAdjustments,
    adjustedPoints,
  };
};
