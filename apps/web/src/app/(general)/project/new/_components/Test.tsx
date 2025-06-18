import { getPathDefs } from "@dddorok/utils";
import { extractControlPoints } from "@dddorok/utils/chart/control-point";
import {
  analyzeSVGPaths,
  getGridPointsFromPaths,
  numToAlpha,
  SvgPath,
} from "@dddorok/utils/chart/svg-grid";
import {
  PathDefinition,
  Point,
  ControlPoint,
} from "@dddorok/utils/chart/types";
import React, { useState, useEffect } from "react";

import { useAdjuestment } from "./useAdjuestment";

interface AdjustedPath extends PathDefinition {
  start: Point;
  end: Point;
  adjustedControlPoints?: ControlPoint[];
}

interface GridAdjustments {
  [key: string]: number;
}

const SVGPointEditor: React.FC = () => {
  // SVG 문자열 (초기 데이터)
  const initialSvgContent: string = `<svg width="123" height="263" viewBox="0 0 123 263" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="&#235;&#157;&#188;&#236;&#154;&#180;&#235;&#147;&#156;&#235;&#132;&#165; &#236;&#133;&#139;&#236;&#157;&#184;&#237;&#152;&#149; &#236;&#149;&#158;&#235;&#170;&#184;&#237;&#140;&#144;">
<path id="BODY_SHOULDER_SLOPE_WIDTH" d="M86 15L46 3" stroke="black"/>
<path id="BODY_FRONT_NECK_CIRCUMFERENCE" d="M46 3C44.5 33.5 33.5 50 5 50" stroke="black"/>
<path id="BODY_HEM_WIDTH" d="M5 259H120" stroke="black"/>
<path id="BODY_WAIST_SLOPE_LENGTH" d="M120 259L120 111" stroke="black"/>
<path id="BODY_FRONT_ARMHOLE_CIRCUMFERENCE" d="M120 111C120 111 108.698 111.1 98.8756 104.64C86.5 96.5 86 79.5 86 79.5L86 15" stroke="black"/>
</g>
</svg>`;
  const {
    gridAdjustments,
    setGridAdjustments,
    handleGridAdjustment,
    originalGridSpacing,
    initial,
  } = useAdjuestment();

  // State 정의
  const [initialPoints, setInitialPoints] = useState<Point[]>([]);
  const [pathDefinitions, setPathDefinitions] = useState<PathDefinition[]>([]);

  useEffect(() => {
    // SVG 파싱
    const parsedPaths = analyzeSVGPaths(initialSvgContent);
    const gridPoints = getGridPointsFromPaths(parsedPaths);
    console.log("gridPoints: ", gridPoints);

    // 색상 배열
    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

    // Path 정의 생성
    const pathDefs = parsedPaths
      .map((path: SvgPath, index: number): PathDefinition | null => {
        const pathDef = getPathDefs(path, gridPoints);
        if (pathDef) {
          pathDef.color = colors[index % colors.length] || "#000000";
        }
        return pathDef;
      })
      .filter((pathDef): pathDef is PathDefinition => pathDef !== null);

    setInitialPoints(gridPoints);
    setPathDefinitions(pathDefs);
  }, []);

  useEffect(() => {
    if (initialPoints.length > 0) {
      initial(initialPoints);
    }
  }, [initialPoints]);

  // 조정된 포인트 계산
  const getAdjustedPoints = (): Point[] => {
    if (initialPoints.length === 0) return [];

    const xs = Array.from(new Set(initialPoints.map((p: Point) => p.x))).sort(
      (a, b) => a - b
    );
    const ys = Array.from(new Set(initialPoints.map((p: Point) => p.y))).sort(
      (a, b) => a - b
    );

    // 기준점 (첫 번째 점)
    const baseX = xs[0];
    const baseY = ys[0];

    if (!baseX || !baseY) return [];

    // 각 열의 X 좌표 계산
    const adjustedXs = [baseX];

    for (let i = 1; i < xs.length; i++) {
      const colKey = `${i}-${i + 1}`;
      const multiplier = gridAdjustments[colKey] || 1;
      const spacing =
        originalGridSpacing[colKey] || (xs[i] || 0) - (xs[i - 1] || 0);
      adjustedXs.push((adjustedXs[i - 1] || 0) + spacing * multiplier);
    }

    // 각 행의 Y 좌표 계산
    const adjustedYs = [baseY];
    for (let i = 1; i < ys.length; i++) {
      const rowKey = `${numToAlpha(i - 1)}-${numToAlpha(i)}`;
      const multiplier = gridAdjustments[rowKey] || 1;
      const spacing =
        originalGridSpacing[rowKey] || (ys[i] || 0) - (ys[i - 1] || 0);
      adjustedYs.push((adjustedYs[i - 1] || 0) + spacing * multiplier);
    }

    // 조정된 그리드 포인트 생성
    const adjustedPoints: Point[] = [];
    adjustedYs.forEach((y: number, row: number) => {
      adjustedXs.forEach((x: number, col: number) => {
        adjustedPoints.push({
          id: `${numToAlpha(row)}${col + 1}`,
          x,
          y,
        });
      });
    });

    return adjustedPoints;
  };

  // 포인트 찾기 헬퍼 함수
  const findPoint = (id: string, pointList?: Point[]): Point | undefined => {
    const points = pointList || getAdjustedPoints();
    return points.find((p: Point) => p.id === id);
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

    // 각 제어점을 개별적으로 조정
    const adjustedControlPoints = pathDef.controlPoints.map(
      (cp: ControlPoint): ControlPoint => {
        // 원본 시작점-끝점을 기준으로 한 제어점의 상대적 위치 계산
        const originalDx = originalEnd.x - originalStart.x;
        const originalDy = originalEnd.y - originalStart.y;

        // 제어점의 원본 상대 위치 (0~1 범위)
        let relativeX: number, relativeY: number;

        if (Math.abs(originalDx) > 0.1) {
          relativeX = (cp.x - originalStart.x) / originalDx;
        } else {
          relativeX = 0;
        }

        if (Math.abs(originalDy) > 0.1) {
          relativeY = (cp.y - originalStart.y) / originalDy;
        } else {
          relativeY = 0;
        }

        // 현재 시작점-끝점을 기준으로 제어점 위치 재계산
        const currentDx = currentEnd.x - currentStart.x;
        const currentDy = currentEnd.y - currentStart.y;

        return {
          x: currentStart.x + relativeX * currentDx,
          y: currentStart.y + relativeY * currentDy,
        };
      }
    );

    return adjustedControlPoints;
  };

  // 현재 조정값으로 계산된 패스 라인들 가져오기
  const getAdjustedPaths = (): AdjustedPath[] => {
    const adjustedPoints = getAdjustedPoints();

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

  // 두 점 사이의 거리 계산
  const calculateDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // 그리드 간격 조정값 변경
  // const handleGridAdjustment = (gridKey: string, value: string): void => {
  //   setGridAdjustments((prev) => ({
  //     ...prev,
  //     [gridKey]: parseFloat(value),
  //   }));
  // };

  // 리셋 함수
  const resetAdjustments = (): void => {
    const resetObj: GridAdjustments = {};
    Object.keys(originalGridSpacing).forEach((key: string) => {
      resetObj[key] = 1;
    });
    setGridAdjustments(resetObj);
  };

  const adjustedPoints = getAdjustedPoints();
  const adjustedPaths = getAdjustedPaths();

  if (initialPoints.length === 0) {
    return <div className="p-6">SVG 파싱 중...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">
        SVG 그리드 간격 조정 편집기
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* 그리드 간격 조정 컨트롤 패널 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">그리드 간격 조정</h2>

          <div className="space-y-6">
            {/* 행 간격 조정 */}
            <div>
              <h3 className="text-md font-medium mb-3 text-blue-600">
                행 간격 (세로)
              </h3>

              {Object.keys(originalGridSpacing)
                .filter(
                  (key: string) => key.includes("-") && key.match(/[a-z]/)
                )
                .map((rowKey: string) => (
                  <div key={rowKey} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {rowKey.toUpperCase()} 간격
                    </label>
                    <div className="text-xs text-gray-600 mb-1">
                      원본: {originalGridSpacing[rowKey]?.toFixed(1)}px
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={gridAdjustments[rowKey] || 1}
                      onChange={(e) =>
                        handleGridAdjustment(rowKey, e.target.value)
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-gray-600">
                      {gridAdjustments[rowKey] || 1}x (
                      {(
                        (originalGridSpacing[rowKey] || 0) *
                        (gridAdjustments[rowKey] || 1)
                      ).toFixed(1)}
                      px)
                    </span>
                  </div>
                ))}
            </div>

            {/* 열 간격 조정 */}
            <div className="border-t pt-4">
              <h3 className="text-md font-medium mb-3 text-green-600">
                열 간격 (가로)
              </h3>

              {Object.keys(originalGridSpacing)
                .filter(
                  (key: string) => key.includes("-") && !key.match(/[a-z]/)
                )
                .map((colKey: string) => (
                  <div key={colKey} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {colKey} 간격
                    </label>
                    <div className="text-xs text-gray-600 mb-1">
                      원본: {originalGridSpacing[colKey]?.toFixed(1)}px
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={gridAdjustments[colKey] || 1}
                      onChange={(e) =>
                        handleGridAdjustment(colKey, e.target.value)
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-gray-600">
                      {gridAdjustments[colKey] || 1}x (
                      {(
                        (originalGridSpacing[colKey] || 0) *
                        (gridAdjustments[colKey] || 1)
                      ).toFixed(1)}
                      px)
                    </span>
                  </div>
                ))}
            </div>

            <button
              onClick={resetAdjustments}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              모든 조정값 리셋
            </button>
          </div>
        </div>

        {/* SVG 캔버스 */}
        <div className="lg:col-span-3">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">그리드 좌표 평면</h2>

            <svg
              width="100%"
              height="500"
              viewBox="0 0 400 350"
              className="border border-gray-300 bg-white"
            >
              {/* 격자 */}
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* 조정된 그리드 라인들 */}
              {adjustedPoints.map((point: Point) => {
                const row = point.id[0];
                const col = point.id[1];

                if (!row || !col) return null;

                // 가로 라인 (같은 행의 다음 열로)
                if (col < "9") {
                  const nextColPoint = adjustedPoints.find(
                    (p: Point) => p.id === `${row}${parseInt(col) + 1}`
                  );
                  if (nextColPoint) {
                    return (
                      <line
                        key={`grid-h-${point.id}`}
                        x1={point.x}
                        y1={point.y}
                        x2={nextColPoint.x}
                        y2={nextColPoint.y}
                        stroke="#9ca3af"
                        strokeWidth="1"
                      />
                    );
                  }
                }
                return null;
              })}

              {adjustedPoints.map((point: Point) => {
                const row = point.id[0];
                const col = point.id[1];

                if (!row || !col) return null;

                // 세로 라인 (같은 열의 다음 행으로)
                if (row < "z") {
                  const nextRowChar = String.fromCharCode(
                    row.charCodeAt(0) + 1
                  );
                  const nextRowPoint = adjustedPoints.find(
                    (p: Point) => p.id === `${nextRowChar}${col}`
                  );
                  if (nextRowPoint) {
                    return (
                      <line
                        key={`grid-v-${point.id}`}
                        x1={point.x}
                        y1={point.y}
                        x2={nextRowPoint.x}
                        y2={nextRowPoint.y}
                        stroke="#9ca3af"
                        strokeWidth="1"
                      />
                    );
                  }
                }
                return null;
              })}

              {/* 패스 라인들 */}
              {adjustedPaths.map((pathData: AdjustedPath) => {
                return (
                  <g key={`path-${pathData.id}`}>
                    {pathData.type === "curve" &&
                    pathData.adjustedControlPoints ? (
                      // 베지어 곡선
                      <path
                        d={`M ${pathData.start.x} ${pathData.start.y} C ${pathData?.adjustedControlPoints[0]?.x} ${pathData?.adjustedControlPoints[0]?.y} ${pathData?.adjustedControlPoints[1]?.x} ${pathData?.adjustedControlPoints[1]?.y} ${pathData.end.x} ${pathData.end.y}`}
                        fill="none"
                        stroke={pathData.color}
                        strokeWidth="4"
                      />
                    ) : (
                      // 직선
                      <line
                        x1={pathData.start.x}
                        y1={pathData.start.y}
                        x2={pathData.end.x}
                        y2={pathData.end.y}
                        stroke={pathData.color}
                        strokeWidth="4"
                      />
                    )}

                    {/* 제어점 표시 (곡선인 경우) */}
                    {pathData.type === "curve" &&
                      pathData.adjustedControlPoints && (
                        <g>
                          {pathData.adjustedControlPoints.map(
                            (cp: ControlPoint, index: number) => (
                              <g key={`cp-${index}`}>
                                <circle
                                  cx={cp.x}
                                  cy={cp.y}
                                  r="2"
                                  fill={pathData.color}
                                  fillOpacity="0.5"
                                  stroke={pathData.color}
                                  strokeWidth="1"
                                />
                                <line
                                  x1={
                                    index === 0
                                      ? pathData.start.x
                                      : pathData?.adjustedControlPoints![0]?.x
                                  }
                                  y1={
                                    index === 0
                                      ? pathData.start.y
                                      : pathData?.adjustedControlPoints![0]?.y
                                  }
                                  x2={cp.x}
                                  y2={cp.y}
                                  stroke={pathData.color}
                                  strokeWidth="1"
                                  strokeDasharray="2,2"
                                  strokeOpacity="0.5"
                                />
                              </g>
                            )
                          )}
                        </g>
                      )}

                    {/* 거리 표시 */}
                    <text
                      x={(pathData.start.x + pathData.end.x) / 2}
                      y={(pathData.start.y + pathData.end.y) / 2 - 15}
                      fontSize="9"
                      fill={pathData.color}
                      textAnchor="middle"
                      className="pointer-events-none select-none font-bold"
                    >
                      {calculateDistance(pathData.start, pathData.end).toFixed(
                        1
                      )}
                      px
                    </text>
                    {/* 패스 이름 */}
                    <text
                      x={(pathData.start.x + pathData.end.x) / 2}
                      y={(pathData.start.y + pathData.end.y) / 2 + 5}
                      fontSize="7"
                      fill="#374151"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {pathData.id.replace("BODY_", "").replace(/_/g, " ")}
                    </text>
                  </g>
                );
              })}

              {/* 그리드 포인트들 */}
              {adjustedPoints.map((point: Point) => {
                return (
                  <g key={`point-${point.id}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="#374151"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <text
                      x={point.x + 6}
                      y={point.y - 6}
                      fontSize="8"
                      fill="#374151"
                      className="pointer-events-none select-none font-medium"
                    >
                      {point.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4 text-sm text-gray-600">
              <p>• 회색 선: 그리드 라인</p>
              <p>• 검은 점: 그리드 포인트 (SVG에서 추출됨)</p>
              <p>• 컬러 굵은 선: SVG 패스 (곡선은 베지어 곡선으로 표시)</p>
              <p>• 작은 컬러 점: 곡선의 제어점</p>
              <p>• 왼쪽 패널에서 행/열 간격을 조정하세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 파싱된 데이터 정보 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">추출된 그리드 포인트</h3>
          <pre className="bg-white p-3 rounded border text-sm overflow-x-auto max-h-40">
            {JSON.stringify(adjustedPoints, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">파싱된 패스 정의</h3>
          <pre className="bg-white p-3 rounded border text-sm overflow-x-auto max-h-40">
            {JSON.stringify(pathDefinitions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SVGPointEditor;
