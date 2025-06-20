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
  });
  const adjustedYs = calculateAdjustedYs({
    ys,
    gridAdjustments,
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
}: {
  xs: number[];
  gridAdjustments: GridAdjustments;
}): number[] => {
  if (xs.length < 2) return xs;
  const baseX = xs[0];
  if (baseX === undefined) return xs;

  const adjustedXs = [baseX];
  const lastX = xs[xs.length - 1];
  if (lastX === undefined) return xs;

  const totalWidth = lastX - baseX;
  const uniformSpacingX = totalWidth / (xs.length - 1);

  for (let i = 1; i < xs.length; i++) {
    const colKey = `${i}-${i + 1}`;
    const multiplier = gridAdjustments[colKey] || 1;
    const adjustedSpacing = uniformSpacingX * multiplier;
    const prevX = adjustedXs[i - 1];
    if (prevX === undefined) continue;
    adjustedXs.push(prevX + adjustedSpacing);
  }

  return adjustedXs as number[];
};

// 조정된 Y 좌표들 계산
const calculateAdjustedYs = ({
  ys,
  gridAdjustments,
}: {
  ys: number[];
  gridAdjustments: GridAdjustments;
}): number[] => {
  if (ys.length < 2) return ys;
  const baseY = ys[0];
  if (baseY === undefined) return ys;

  const adjustedYs = [baseY];
  const lastY = ys[ys.length - 1];
  if (lastY === undefined) return ys;

  const totalHeight = lastY - baseY;
  const uniformSpacingY = totalHeight / (ys.length - 1);

  for (let i = 1; i < ys.length; i++) {
    const rowKey = `${numToAlpha(i - 1)}-${numToAlpha(i)}`;
    const multiplier = gridAdjustments[rowKey] || 1;
    const adjustedSpacing = uniformSpacingY * multiplier;
    const prevY = adjustedYs[i - 1];
    if (prevY === undefined) continue;
    adjustedYs.push(prevY + adjustedSpacing);
  }

  return adjustedYs as number[];
};
