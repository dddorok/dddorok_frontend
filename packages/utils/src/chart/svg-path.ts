import { extractControlPoints } from "./control-point";
import { SvgPath } from "./svg-grid";
import { Point, PathDefinition } from "./types";

export function getPathDefs(
  path: SvgPath,
  points: Point[]
): PathDefinition | null {
  // path의 실제 시작점과 끝점 찾기
  let startPoint, endPoint;

  if (path?.element) {
    const pathLength = path.element.getTotalLength();
    startPoint = {
      x: path.element.getPointAtLength(0).x,
      y: path.element.getPointAtLength(0).y,
    };
    endPoint = {
      x: path.element.getPointAtLength(pathLength).x,
      y: path.element.getPointAtLength(pathLength).y,
    };
  } else {
    // element가 없는 경우 points 배열에서 시작점과 끝점 찾기
    startPoint = path.points[0];
    endPoint = path.points[path.points.length - 1];
  }

  if (!startPoint || !endPoint) return null;

  const startGridId = findNearestGridPointId(startPoint, points);
  const endGridId = findNearestGridPointId(endPoint, points);

  if (!startGridId || !endGridId) return null;

  const controlPoints =
    path.type === "curve" ? extractControlPoints(path.data || "") : [];

  return {
    id: path.id,
    name: path.id,
    points: [startGridId, endGridId],
    type: path.type,
    color: "#000000", // 기본 색상, 나중에 설정
    controlPoints: controlPoints.length > 0 ? controlPoints : undefined,
  };
}

function findNearestGridPointId(
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
