// SVG/그리드/포인트 관련 유틸 함수 모음

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
