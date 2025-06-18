import { PathDefinition, Point, ControlPoint } from "@dddorok/utils";
import { useState } from "react";

import { adjustControlPoints } from "../_utils/adjustControlPoints";

interface AdjustedPath extends PathDefinition {
  start: Point;
  end: Point;
  adjustedControlPoints?: ControlPoint[];
}

export const useAdjustedPaths = ({
  adjustedPoints,
  initialPoints,
}: {
  adjustedPoints: Point[];
  initialPoints: Point[];
}) => {
  const [pathDefinitions, setPathDefinitions] = useState<PathDefinition[]>([]);

  // 포인트 찾기 헬퍼 함수
  const findPoint = (id: string, pointList?: Point[]): Point | undefined => {
    const points = pointList || adjustedPoints;
    return points.find((p: Point) => p.id === id);
  };

  // 현재 조정값으로 계산된 패스 라인들 가져오기
  const getAdjustedPaths = (): AdjustedPath[] => {
    return pathDefinitions
      .map((pathDef: PathDefinition): AdjustedPath | null => {
        const startPoint = findPoint(pathDef.points[0], adjustedPoints);
        const endPoint = findPoint(pathDef.points[1], adjustedPoints);

        if (!startPoint || !endPoint) return null;

        // 곡선인 경우 조정된 제어점 계산
        let adjustedControlPoints: ControlPoint[] | null = null;
        if (pathDef.type === "curve" && pathDef.controlPoints) {
          adjustedControlPoints = getAdjustedControlPoints(pathDef);
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

  // 곡선의 제어점을 비율로 조정하는 함수 (개선된 버전)
  const getAdjustedControlPoints = (
    pathDef: PathDefinition
  ): ControlPoint[] | null => {
    if (!pathDef.controlPoints || pathDef.type !== "curve") return null;

    // 현재 패스의 시작점과 끝점 찾기
    const currentStart = findPoint(pathDef.points[0]);
    const currentEnd = findPoint(pathDef.points[1]);

    if (!currentStart || !currentEnd) return null;

    // 원본 패스의 시작점과 끝점 찾기
    const originalStart = initialPoints.find(
      (p: Point) => p.id === pathDef.points[0]
    );
    const originalEnd = initialPoints.find(
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

  const initialPathDefinitions = (pathDefinitions: PathDefinition[]) => {
    setPathDefinitions(pathDefinitions);
  };

  const adjustedPaths = getAdjustedPaths();

  return {
    initialPathDefinitions,
    adjustedPaths,
  };
};
