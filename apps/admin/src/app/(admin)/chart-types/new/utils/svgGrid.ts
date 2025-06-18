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

export function findNearestGridPointId(
  point: { x: number; y: number },
  gridPoints: { id: string; x: number; y: number }[]
): string | null {
  let minDist = Infinity;
  let nearestId: string | null = null;
  for (const grid of gridPoints) {
    const dist = Math.hypot(grid.x - point.x, grid.y - point.y);
    if (dist < minDist) {
      minDist = dist;
      nearestId = grid.id;
    }
  }
  return nearestId;
}
