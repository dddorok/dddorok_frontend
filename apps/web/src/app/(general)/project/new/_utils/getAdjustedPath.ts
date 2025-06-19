import { ControlPoint, PathDefinition, Point } from "@dddorok/utils";

import { adjustControlPoints } from "./adjustControlPoints";

interface AdjustedPath extends PathDefinition {
  start: Point;
  end: Point;
  adjustedControlPoints?: ControlPoint[];
}

export const getAdjustedPath = (props: {
  adjustedPoints: Point[];
  gridPoints: Point[];
  pathDefinitions: PathDefinition[];
}) => {
  // 포인트 찾기 헬퍼 함수
  const _findPoint = (id: string, pointList?: Point[]): Point | undefined => {
    const points = pointList || props.adjustedPoints;
    return points.find((p: Point) => p.id === id);
  };

  // 곡선의 제어점을 비율로 조정하는 함수
  const _getAdjustedControlPoints = (
    pathDef: PathDefinition
  ): ControlPoint[] | null => {
    if (!pathDef.controlPoints || pathDef.type !== "curve") return null;

    // 현재 패스의 시작점과 끝점 찾기
    const currentStart = _findPoint(pathDef.points[0]);
    const currentEnd = _findPoint(pathDef.points[1]);

    if (!currentStart || !currentEnd) return null;

    // 원본 패스의 시작점과 끝점 찾기
    const originalStart = props.gridPoints.find(
      (p: Point) => p.id === pathDef.points[0]
    );
    const originalEnd = props.gridPoints.find(
      (p: Point) => p.id === pathDef.points[1]
    );

    if (!originalStart || !originalEnd) return null;

    // 유틸 함수를 사용하여 제어점 조정
    return adjustControlPoints(
      pathDef.controlPoints,
      originalStart,
      originalEnd,
      currentStart,
      currentEnd
    );
  };

  // 현재 조정값으로 계산된 패스 라인들 가져오기
  const _getAdjustedPaths = (): AdjustedPath[] => {
    return props.pathDefinitions
      .map((pathDef: PathDefinition): AdjustedPath | null => {
        const startPoint = _findPoint(pathDef.points[0], props.adjustedPoints);
        const endPoint = _findPoint(pathDef.points[1], props.adjustedPoints);

        if (!startPoint || !endPoint) return null;

        // 곡선인 경우 조정된 제어점 계산
        let adjustedControlPoints: ControlPoint[] | null = null;
        if (pathDef.type === "curve" && pathDef.controlPoints) {
          adjustedControlPoints = _getAdjustedControlPoints(pathDef);
        }

        return {
          ...pathDef,
          start: startPoint,
          end: endPoint,
          adjustedControlPoints: adjustedControlPoints || undefined,
        };
      })
      .filter((path): path is AdjustedPath => path !== null);
  };

  const adjustedPaths = _getAdjustedPaths();

  return adjustedPaths;
};
