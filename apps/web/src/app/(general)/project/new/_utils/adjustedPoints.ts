import { Point, numToAlpha } from "@dddorok/utils";

import { GridAdjustments, OriginalGridSpacing } from "../types";
import { extractUniqueCoordinates } from "./extractUniqueCoordinates";

// 조정된 포인트 계산
export const getAdjustedPoints = (
  initialPoints: Point[],
  gridAdjustments: GridAdjustments,
  originalGridSpacing: OriginalGridSpacing
): Point[] => {
  if (initialPoints.length === 0) return [];

  const { xs, ys } = extractUniqueCoordinates(initialPoints);
  const adjustedXs = calculateAdjustedXs({
    xs,
    gridAdjustments,
    originalGridSpacing,
  });
  const adjustedYs = calculateAdjustedYs({
    ys,
    gridAdjustments,
    originalGridSpacing,
  });

  return generateGridPoints(adjustedXs, adjustedYs);
};

// 조정된 좌표로 그리드 포인트 생성
const generateGridPoints = (
  adjustedXs: number[],
  adjustedYs: number[]
): Point[] => {
  const gridPoints: Point[] = [];

  adjustedYs.forEach((y: number, row: number) => {
    adjustedXs.forEach((x: number, col: number) => {
      gridPoints.push({
        id: `${numToAlpha(row)}${col + 1}`,
        x,
        y,
      });
    });
  });

  return gridPoints;
};

// 조정된 X 좌표들 계산
const calculateAdjustedXs = ({
  xs,
  gridAdjustments,
  originalGridSpacing,
}: {
  xs: number[];
  gridAdjustments: GridAdjustments;
  originalGridSpacing: OriginalGridSpacing;
}): number[] => {
  const baseX = xs[0];
  if (!baseX) return [];

  const adjustedXs = [baseX];

  for (let i = 1; i < xs.length; i++) {
    const colKey = `${i}-${i + 1}`;
    const multiplier = gridAdjustments[colKey] || 1;
    const originalSpacing =
      originalGridSpacing[colKey] || (xs[i] || 0) - (xs[i - 1] || 0);
    const adjustedSpacing = originalSpacing * multiplier;

    adjustedXs.push((adjustedXs[i - 1] || 0) + adjustedSpacing);
  }

  return adjustedXs;
};

// 조정된 Y 좌표들 계산
const calculateAdjustedYs = ({
  ys,
  gridAdjustments,
  originalGridSpacing,
}: {
  ys: number[];
  gridAdjustments: GridAdjustments;
  originalGridSpacing: OriginalGridSpacing;
}): number[] => {
  const baseY = ys[0];
  if (!baseY) return [];

  const adjustedYs = [baseY];

  for (let i = 1; i < ys.length; i++) {
    const rowKey = `${numToAlpha(i - 1)}-${numToAlpha(i)}`;
    const multiplier = gridAdjustments[rowKey] || 1;
    const originalSpacing =
      originalGridSpacing[rowKey] || (ys[i] || 0) - (ys[i - 1] || 0);
    const adjustedSpacing = originalSpacing * multiplier;

    adjustedYs.push((adjustedYs[i - 1] || 0) + adjustedSpacing);
  }

  return adjustedYs;
};
