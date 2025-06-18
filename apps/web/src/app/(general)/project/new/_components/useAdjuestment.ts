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
    // 원본 그리드 간격 계산
    const xs = Array.from(new Set(initialPoints.map((p: Point) => p.x))).sort(
      (a, b) => a - b
    );
    const ys = Array.from(new Set(initialPoints.map((p: Point) => p.y))).sort(
      (a, b) => a - b
    );

    const spacing: OriginalGridSpacing = {};
    const adjustments: GridAdjustments = {};

    // 행 간격 (세로)
    for (let i = 0; i < ys.length - 1; i++) {
      const rowKey = `${numToAlpha(i)}-${numToAlpha(i + 1)}`;
      spacing[rowKey] = (ys[i + 1] || 0) - (ys[i] || 0);
      if (!gridAdjustments[rowKey]) {
        adjustments[rowKey] = 1;
      }
    }

    // 열 간격 (가로)
    for (let i = 0; i < xs.length - 1; i++) {
      const colKey = `${i + 1}-${i + 2}`;
      spacing[colKey] = (xs[i + 1] || 0) - (xs[i] || 0);
      if (!gridAdjustments[colKey]) {
        adjustments[colKey] = 1;
      }
    }

    setOriginalGridSpacing(spacing);
    setGridAdjustments((prev) => ({ ...prev, ...adjustments }));
  };

  return {
    gridAdjustments,
    setGridAdjustments,
    handleGridAdjustment,
    originalGridSpacing,
    initial,
  };
};
