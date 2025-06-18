import { numToAlpha, Point } from "@dddorok/utils";
import { useState } from "react";

interface GridAdjustments {
  [key: string]: number;
}
interface OriginalGridSpacing {
  [key: string]: number;
}

export const useAdjuestment = (initialPoints: Point[]) => {
  const [gridAdjustments, setGridAdjustments] = useState<GridAdjustments>({});
  const [originalGridSpacing, setOriginalGridSpacing] =
    useState<OriginalGridSpacing>({});

  const adjustedPoints = getAdjustedPoints(
    initialPoints,
    gridAdjustments,
    originalGridSpacing
  );

  const handleGridAdjustment = (gridKey: string, value: string): void => {
    setGridAdjustments((prev) => ({
      ...prev,
      [gridKey]: parseFloat(value),
    }));
  };

  const initialAdjustments = (initialPoints: Point[]) => {
    const { xs, ys } = extractUniqueCoordinates(initialPoints);
    const spacing = calculateOriginalSpacing(xs, ys);
    const adjustments = createDefaultAdjustments(xs, ys);

    setOriginalGridSpacing(spacing);
    setGridAdjustments((prev) => ({ ...prev, ...adjustments }));
  };

  const resetAdjustments = (): void => {
    const resetObj: GridAdjustments = {};
    Object.keys(originalGridSpacing).forEach((key: string) => {
      resetObj[key] = 1;
    });
    setGridAdjustments(resetObj);
  };

  return {
    gridAdjustments,
    handleGridAdjustment,
    originalGridSpacing,
    initialAdjustments,
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

// 고유한 X, Y 좌표 추출
export const extractUniqueCoordinates = (points: Point[]) => {
  const xs = Array.from(new Set(points.map((p: Point) => p.x))).sort(
    (a, b) => a - b
  );
  const ys = Array.from(new Set(points.map((p: Point) => p.y))).sort(
    (a, b) => a - b
  );
  return { xs, ys };
};

// 조정된 포인트 계산
const getAdjustedPoints = (
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
