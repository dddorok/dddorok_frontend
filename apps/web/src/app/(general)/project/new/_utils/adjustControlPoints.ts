import { ControlPoint, Point } from "@dddorok/utils/chart/types";

interface ControlPointAdjustmentParams {
  controlPoint: ControlPoint;
  originalStart: Point;
  originalEnd: Point;
  currentStart: Point;
  currentEnd: Point;
}

/**
 * 제어점을 원본 패스의 상대적 위치를 유지하면서 새로운 시작점-끝점에 맞게 조정
 */
export const adjustControlPoint = ({
  controlPoint,
  originalStart,
  originalEnd,
  currentStart,
  currentEnd,
}: ControlPointAdjustmentParams): ControlPoint => {
  // 원본 시작점-끝점을 기준으로 한 제어점의 상대적 위치 계산
  const originalDx = originalEnd.x - originalStart.x;
  const originalDy = originalEnd.y - originalStart.y;

  // 제어점의 원본 상대 위치 (0~1 범위)
  const relativeX =
    Math.abs(originalDx) > 0.1
      ? (controlPoint.x - originalStart.x) / originalDx
      : 0;

  const relativeY =
    Math.abs(originalDy) > 0.1
      ? (controlPoint.y - originalStart.y) / originalDy
      : 0;

  // 현재 시작점-끝점을 기준으로 제어점 위치 재계산
  const currentDx = currentEnd.x - currentStart.x;
  const currentDy = currentEnd.y - currentStart.y;

  return {
    x: currentStart.x + relativeX * currentDx,
    y: currentStart.y + relativeY * currentDy,
  };
};

/**
 * 여러 제어점을 한번에 조정
 */
export const adjustControlPoints = (
  controlPoints: ControlPoint[],
  originalStart: Point,
  originalEnd: Point,
  currentStart: Point,
  currentEnd: Point
): ControlPoint[] => {
  return controlPoints.map((controlPoint) =>
    adjustControlPoint({
      controlPoint,
      originalStart,
      originalEnd,
      currentStart,
      currentEnd,
    })
  );
};
