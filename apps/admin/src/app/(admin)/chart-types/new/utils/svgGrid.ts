// SVG/그리드/포인트 관련 유틸 함수 모음

import { SvgPath } from "../types";

export const numToAlpha = (n: number) => String.fromCharCode(97 + n);

export const mergeCoords = (coords: number[], threshold = 1.5) => {
  const sorted = [...coords].sort((a, b) => a - b);
  const merged: number[] = [];
  sorted.forEach((val) => {
    const lastVal = merged[merged.length - 1];
    if (
      merged.length === 0 ||
      (typeof lastVal === "number" && Math.abs(lastVal - val) > threshold)
    ) {
      merged.push(val);
    }
  });
  return merged;
};

export const getGridPointsFromPaths = (
  paths: SvgPath[],
  threshold = 1.5
): { id: string; x: number; y: number; type: "grid"; pathId?: string }[] => {
  const rawPoints: { x: number; y: number }[] = [];
  paths.forEach((path) => {
    if (path.points.length > 0) {
      const startPoint = path.points[0];
      const endPoint = path.points[path.points.length - 1];
      if (startPoint && endPoint) {
        rawPoints.push(startPoint);
        rawPoints.push(endPoint);
      }
    }
  });
  const merged: { x: number; y: number }[] = [];
  rawPoints.forEach((pt) => {
    const found = merged.find(
      (m) =>
        Math.abs(m.x - pt.x) <= threshold && Math.abs(m.y - pt.y) <= threshold
    );
    if (!found) merged.push(pt);
  });
  const xs = Array.from(new Set(merged.map((p) => Math.round(p.x)))).sort(
    (a, b) => a - b
  );
  const ys = Array.from(new Set(merged.map((p) => Math.round(p.y)))).sort(
    (a, b) => a - b
  );
  const gridPoints: {
    id: string;
    x: number;
    y: number;
    type: "grid";
    pathId?: string;
  }[] = [];
  ys.forEach((y, row) => {
    xs.forEach((x, col) => {
      gridPoints.push({
        id: `${numToAlpha(row)}${col + 1}`,
        x,
        y,
        type: "grid" as const,
        pathId: undefined,
      });
    });
  });
  return gridPoints;
};

export const getGridLines = (points: any[]) => {
  const xs = mergeCoords(points.map((p) => p.x));
  const ys = mergeCoords(points.map((p) => p.y));
  return { xs, ys };
};

export const extractControlPoints = (pathData: string) => {
  const controlPoints: { x: number; y: number }[] = [];
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  commands.forEach((command) => {
    const type = command[0];
    const coords = command
      .slice(1)
      .trim()
      .split(/[,\s]+/)
      .map(Number);
    if (type === "C") {
      for (let i = 0; i < 4; i += 2) {
        const x = coords[i];
        const y = coords[i + 1];
        if (
          typeof x === "number" &&
          typeof y === "number" &&
          !isNaN(x) &&
          !isNaN(y)
        ) {
          controlPoints.push({ x, y });
        }
      }
    } else if (type === "Q") {
      const x = coords[0];
      const y = coords[1];
      if (
        typeof x === "number" &&
        typeof y === "number" &&
        !isNaN(x) &&
        !isNaN(y)
      ) {
        controlPoints.push({ x, y });
      }
    }
  });
  return controlPoints;
};
