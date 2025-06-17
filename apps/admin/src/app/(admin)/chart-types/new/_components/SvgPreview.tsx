import React, { useRef, useState } from "react";

import { ChartPoint, MeasurementItem, SvgPath } from "../types";
import { getSvgPreviewData } from "../utils/etc";
import { getGridLines } from "../utils/svgGrid";
// 임시
const scale = 1;

interface SvgPreviewProps {
  svgContent: string;
  paths: SvgPath[];
  points: ChartPoint[];
  onPointClick: (pointId: string) => void;
  highlightedPathId?: string | null;
  svgDimensions: { width: number; height: number; minX: number; minY: number };
}

export function SvgPreview({
  svgContent,
  paths,
  points,
  highlightedPathId = null,
  ...props
}: SvgPreviewProps) {
  const { previewW, previewH, svgBoxX, svgBoxY, svgBoxW, svgBoxH } =
    getSvgPreviewData(svgContent, "", points);

  const svgRef = useRef<HTMLDivElement>(null);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = (e.clientX - rect.left) / scale + props.svgDimensions.minX;
    const offsetY = (e.clientY - rect.top) / scale + props.svgDimensions.minY;

    const closest = getClosetPoint({ points, offsetX, offsetY });

    if (closest) {
      props.onPointClick(closest.id);
    }
  };

  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const handlePointMouseEnter = (pointId: string) => {
    setHoveredPointId(pointId);
  };

  const handlePointMouseLeave = () => {
    setHoveredPointId(null);
  };

  // SVG content를 파싱하여 path 요소들을 추출하고 스타일을 적용하는 함수
  const getStyledSvgContent = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = doc.documentElement;

    // 모든 path 요소에 대해 스타일 적용
    svgElement.querySelectorAll("path").forEach((path) => {
      const pathId = path.getAttribute("id");
      if (pathId && pathId === highlightedPathId) {
        path.setAttribute("stroke", "#22c55e");
        path.setAttribute("stroke-width", "3");
      }
    });

    return svgElement.innerHTML;
  };

  return (
    <div className="relative">
      {paths.length > 0 && (
        <div className="absolute top-2 right-4 z-10 text-sm text-blue-600 font-semibold">
          path 개수: {paths.length}
        </div>
      )}
      <svg
        width={previewW}
        height={previewH}
        viewBox={`${svgBoxX} ${svgBoxY} ${svgBoxW} ${svgBoxH}`}
        className="bg-white block"
        onClick={handleSvgClick}
      >
        <g
          dangerouslySetInnerHTML={{
            __html: getStyledSvgContent(),
          }}
        />
        {(() => {
          const { xs, ys } = getGridLines(points);
          const xLabels = xs.map((x, i) => i + 1);
          const yLabels = ys.map((y, i) => String.fromCharCode(97 + i));
          return (
            <>
              {xs.map((x, i) => (
                <React.Fragment key={`vx${i}`}>
                  <line
                    x1={x}
                    y1={svgBoxY}
                    x2={x}
                    y2={svgBoxY + svgBoxH}
                    stroke="#bbb"
                    strokeDasharray="4 2"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={svgBoxY + 18}
                    fontSize={13}
                    textAnchor="middle"
                    fill="#888"
                    fontWeight="bold"
                  >
                    {xLabels[i]}
                  </text>
                </React.Fragment>
              ))}
              {ys.map((y, i) => (
                <React.Fragment key={`hy${i}`}>
                  <line
                    x1={svgBoxX}
                    y1={y}
                    x2={svgBoxX + svgBoxW}
                    y2={y}
                    stroke="#bbb"
                    strokeDasharray="4 2"
                    strokeWidth={1}
                  />
                  <text
                    x={svgBoxX + 10}
                    y={y + 4}
                    fontSize={13}
                    textAnchor="start"
                    fill="#888"
                    fontWeight="bold"
                  >
                    {yLabels[i]}
                  </text>
                </React.Fragment>
              ))}
            </>
          );
        })()}

        {/* 포인트 */}
        {points.map((pt) => {
          // 선택된 path의 시작점이면 초록색
          // const isStartSelected =
          //   isSelecting &&
          //   selectedPathId &&
          //   selectedPointIndex === 1 &&
          //   measurementItems.find((item) => item.id === selectedPathId)
          //     ?.startPoint === pt.id;

          const isStartSelected = false;
          return (
            <circle
              key={pt.id}
              cx={pt.x}
              cy={pt.y}
              r={isStartSelected ? 8 : pt.id === hoveredPointId ? 5 : 4}
              fill={
                isStartSelected
                  ? "#22c55e"
                  : pt.id === hoveredPointId
                    ? "#f59e42"
                    : "#fff"
              }
              stroke={
                isStartSelected
                  ? "#22c55e"
                  : pt.id === hoveredPointId
                    ? "#f59e42"
                    : "#888"
              }
              strokeWidth={isStartSelected ? 3 : 1}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                props.onPointClick(pt.id);
              }}
              onMouseEnter={() => handlePointMouseEnter(pt.id)}
              onMouseLeave={handlePointMouseLeave}
            />
          );
        })}
        {/* 포인트 id 툴팁 (hover 시) */}
        {points.map((pt) =>
          pt.id === hoveredPointId ? (
            <g key={pt.id}>
              <rect
                x={pt.x - 16}
                y={pt.y + 8}
                width={32}
                height={16}
                fill="#fff"
                stroke="#bbb"
                rx={4}
                ry={4}
              />
              <text
                x={pt.x}
                y={pt.y + 20}
                fontSize={10}
                textAnchor="middle"
                fill="#333"
                style={{ pointerEvents: "none" }}
              >
                {pt.id}
              </text>
            </g>
          ) : null
        )}
      </svg>
      {highlightedPathId && (
        <div className="mt-2 text-sm text-green-600 font-medium">
          강조된 Path: {highlightedPathId}
        </div>
      )}
    </div>
  );
}

const getClosetPoint = ({
  points,
  offsetX,
  offsetY,
}: {
  points: ChartPoint[];
  offsetX: number;
  offsetY: number;
}) => {
  let closest: ChartPoint | null = null;
  let minDist = Infinity;

  for (const pt of points) {
    const dist = Math.sqrt((pt.x - offsetX) ** 2 + (pt.y - offsetY) ** 2);
    if (dist < 10 && dist < minDist) {
      closest = pt;
      minDist = dist;
    }
  }

  return closest;
};
