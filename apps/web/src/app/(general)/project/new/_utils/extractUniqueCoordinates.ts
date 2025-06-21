import { Point } from "@dddorok/utils";

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
