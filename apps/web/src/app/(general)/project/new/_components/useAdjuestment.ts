import { numToAlpha, Point } from "@dddorok/utils";
import { useState } from "react";

interface GridAdjustments {
  [key: string]: number;
}
interface OriginalGridSpacing {
  [key: string]: number;
}
export const useAdjuestment = () => {
  const [gridAdjustments, setGridAdjustments] = useState<GridAdjustments>({});

  const [originalGridSpacing, setOriginalGridSpacing] =
    useState<OriginalGridSpacing>({});

  const handleGridAdjustment = (gridKey: string, value: string): void => {
    setGridAdjustments((prev) => ({
      ...prev,
      [gridKey]: parseFloat(value),
    }));
  };

  const initial = (initialPoints: Point[]) => {
    const { xs, ys } = extractUniqueCoordinates(initialPoints);
    const spacing = calculateOriginalSpacing(xs, ys);
    const adjustments = createDefaultAdjustments(xs, ys);

    setOriginalGridSpacing(spacing);
    setGridAdjustments((prev) => ({ ...prev, ...adjustments }));
  };

  // 고유한 X, Y 좌표 추출
  const extractUniqueCoordinates = (points: Point[]) => {
    const xs = Array.from(new Set(points.map((p: Point) => p.x))).sort(
      (a, b) => a - b
    );
    const ys = Array.from(new Set(points.map((p: Point) => p.y))).sort(
      (a, b) => a - b
    );
    return { xs, ys };
  };

  return {
    gridAdjustments,
    setGridAdjustments,
    handleGridAdjustment,
    originalGridSpacing,
    initial,
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
