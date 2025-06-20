import { getPathDefs } from "@dddorok/utils";
import {
  analyzeSVGPaths,
  getGridPointsFromPaths,
  SvgPath,
} from "@dddorok/utils/chart/svg-grid";
import {
  PathDefinition,
  Point,
  ControlPoint,
} from "@dddorok/utils/chart/types";
import React, { useState, useEffect } from "react";

import {
  AdjustmentProvider,
  useAdjustmentContext,
  useAdjustmentProgressingContext,
} from "./AdjustmentProvider";
import { SliderSection } from "./korean-slider-component";

import { cn } from "@/lib/utils";

const sliderData = [
  // COLS (WIDTH)
  {
    control: "1-2",
    min: 0.1,
    max: 3,
    snapValues: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
    initialValue: 1,
    average: 1,
    value_type: "col",
  },
  {
    control: "2-3",
    min: 0.1,
    max: 3,
    snapValues: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
    initialValue: 1,
    average: 1,
    value_type: "col",
  },
  {
    control: "3-4",
    min: 0.1,
    max: 3,
    snapValues: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
    initialValue: 1,
    average: 1,
    value_type: "col",
  },
  // ROWS (LENGTH)
  {
    control: "a-b",
    min: 0.1,
    max: 3,
    snapValues: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
    initialValue: 0.1,
    average: 1,
    value_type: "row",
  },
  {
    control: "b-c",
    min: 0.1,
    max: 3,
    snapValues: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
    initialValue: 0.5,
    average: 1,
    value_type: "row",
  },
  {
    control: "c-d",
    min: 0.1,
    max: 3,
    snapValues: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
    initialValue: 1.0,
    average: 1,
    value_type: "row",
  },
  {
    control: "d-e",
    min: 0.1,
    max: 3,
    snapValues: [0.1, 0.5, 1, 1.5, 2, 2.5, 3],
    initialValue: 1.0,
    average: 1,
    value_type: "row",
  },
];

interface AdjustedPath extends PathDefinition {
  start: Point;
  end: Point;
  adjustedControlPoints?: ControlPoint[];
}

const initialSvgContent: string = `<svg width="123" height="263" viewBox="0 0 123 263" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="&#235;&#157;&#188;&#236;&#154;&#180;&#235;&#147;&#156;&#235;&#132;&#165; &#236;&#133;&#139;&#236;&#157;&#184;&#237;&#152;&#149; &#236;&#149;&#158;&#235;&#170;&#184;&#237;&#140;&#144;">
<path id="BODY_SHOULDER_SLOPE_WIDTH" d="M86 15L46 3" stroke="black"/>
<path id="BODY_FRONT_NECK_CIRCUMFERENCE" d="M46 3C44.5 33.5 33.5 50 5 50" stroke="black"/>
<path id="BODY_HEM_WIDTH" d="M5 259H120" stroke="black"/>
<path id="BODY_WAIST_SLOPE_LENGTH" d="M120 259L120 111" stroke="black"/>
<path id="BODY_FRONT_ARMHOLE_CIRCUMFERENCE" d="M120 111C120 111 108.698 111.1 98.8756 104.64C86.5 96.5 86 79.5 86 79.5L86 15" stroke="black"/>
</g>
</svg>`;

export function AdjustmentEditor() {
  const [pathDefs, setPathDefs] = useState<PathDefinition[]>([]);
  const [gridPoints, setGridPoints] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 클라이언트 사이드에서만 SVG 파싱 실행
    const parsedPaths = analyzeSVGPaths(initialSvgContent);
    const gridPoints = getGridPointsFromPaths(parsedPaths);

    // Path 정의 생성
    const pathDefs = parsedPaths
      .map((path: SvgPath): PathDefinition | null => {
        const pathDef = getPathDefs(path, gridPoints);
        return pathDef;
      })
      .filter((pathDef): pathDef is PathDefinition => pathDef !== null);

    setPathDefs(pathDefs);
    setGridPoints(gridPoints);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="p-6">SVG 파싱 중...</div>;
  }

  return (
    <AdjustmentProvider
      gridPoints={gridPoints}
      pathDefs={pathDefs}
      sliderData={sliderData}
    >
      <SVGPointEditor />
    </AdjustmentProvider>
  );
}

const SVGPointEditor = () => {
  const { gridAdjustments, handleGridAdjustment } = useAdjustmentContext();

  const { handleAdjustStart, handleAdjustEnd } =
    useAdjustmentProgressingContext();

  const [selectedValueType, setSelectedValueType] = useState<string>("row");

  const sliders = sliderData.filter((s) => s.value_type === selectedValueType);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">그리드 좌표 평면</h2>
            <GridCoordinatePlane />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex gap-4 mb-4 pt-4 pb-2 justify-center">
            {["row", "col"].map((valueType) => (
              <button
                key={valueType}
                onClick={() => setSelectedValueType(valueType)}
                className={cn(
                  "h-9 px-4 text-medium-r border-neutral-N400 border text-neutral-N500 rounded-md ",
                  selectedValueType === valueType &&
                    "bg-primary-PR text-[#FFFFFF] text-medium-b border-primary-PR"
                )}
              >
                {valueType}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              {sliders.map((slider) => (
                <SliderSection
                  key={slider.control}
                  label={slider.control.toUpperCase()}
                  min={slider.min}
                  max={slider.max}
                  snapValues={slider.snapValues}
                  initialValue={
                    gridAdjustments[slider.control] ?? slider.initialValue
                  }
                  average={slider.average}
                  code={slider.control}
                  onValueChange={(value) =>
                    handleGridAdjustment(slider.control, value.toString())
                  }
                  onAdjustStart={() => handleAdjustStart(slider.control)}
                  onAdjustEnd={handleAdjustEnd}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function GridCoordinatePlane() {
  const { adjustedPoints, adjustedPaths } = useAdjustmentContext();
  const { adjustingKey } = useAdjustmentProgressingContext();

  // scale 설정 (기본값 10)
  const scale = 10;

  // 두 점 사이의 거리 계산 (scale 적용)
  const calculateDistance = (p1: Point, p2: Point): number => {
    const distance = Math.sqrt(
      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
    );
    return distance * scale;
  };

  // viewBox 자동 계산
  const xs = adjustedPoints.map((p) => p.x);
  const ys = adjustedPoints.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const padding = 20;
  const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;

  // path가 조정 중인지 확인하는 함수
  const isPathBeingAdjusted = (path: AdjustedPath): boolean => {
    if (!adjustingKey) return false;

    // path의 시작점과 끝점이 조정 중인 그리드 간격에 포함되는지 확인
    const startPoint = adjustedPoints.find(
      (p) => p.x === path.start.x && p.y === path.start.y
    );
    const endPoint = adjustedPoints.find(
      (p) => p.x === path.end.x && p.y === path.end.y
    );

    if (!startPoint || !endPoint) return false;

    const [start, end] = adjustingKey.split("-");

    // 행 간격 조정 중인 경우 (세로)
    if (adjustingKey.match(/[a-z]/)) {
      if (
        startPoint.id[0] === start ||
        startPoint.id[0] === end ||
        endPoint.id[0] === start ||
        endPoint.id[0] === end
      ) {
        return true;
      }
    }
    // 열 간격 조정 중인 경우 (가로)
    else {
      if (
        startPoint.id[1] === start ||
        startPoint.id[1] === end ||
        endPoint.id[1] === start ||
        endPoint.id[1] === end
      ) {
        return true;
      }
    }

    return false;
  };

  // path 색상 결정
  const getPathColor = (path: AdjustedPath): string => {
    if (isPathBeingAdjusted(path)) {
      return "#ef4444"; // 빨간색
    }
    return path.color || "#000000";
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg width="100%" height="100%" viewBox={viewBox}>
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
            const nextRowChar = String.fromCharCode(row.charCodeAt(0) + 1);
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
          const pathColor = getPathColor(pathData);

          return (
            <g key={`path-${pathData.id}`}>
              {pathData.type === "curve" && pathData.adjustedControlPoints ? (
                // 베지어 곡선
                <path
                  d={`M ${pathData.start.x} ${pathData.start.y} C ${pathData?.adjustedControlPoints[0]?.x} ${pathData?.adjustedControlPoints[0]?.y} ${pathData?.adjustedControlPoints[1]?.x} ${pathData?.adjustedControlPoints[1]?.y} ${pathData.end.x} ${pathData.end.y}`}
                  fill="none"
                  stroke={pathColor}
                  strokeWidth="1"
                />
              ) : (
                // 직선
                <line
                  x1={pathData.start.x}
                  y1={pathData.start.y}
                  x2={pathData.end.x}
                  y2={pathData.end.y}
                  stroke={pathColor}
                  strokeWidth="1"
                />
              )}

              {/* 제어점 표시 (곡선인 경우) */}
              {pathData.type === "curve" && pathData.adjustedControlPoints && (
                <g>
                  {pathData.adjustedControlPoints.map(
                    (cp: ControlPoint, index: number) => (
                      <g key={`cp-${index}`}>
                        <circle
                          cx={cp.x}
                          cy={cp.y}
                          r="2"
                          fill={pathColor}
                          fillOpacity="0.5"
                          stroke={pathColor}
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
                          stroke={pathColor}
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
                fill={pathColor}
                textAnchor="middle"
                className="pointer-events-none select-none font-bold"
              >
                {calculateDistance(pathData.start, pathData.end).toFixed(1)}
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
    </div>
  );
}
