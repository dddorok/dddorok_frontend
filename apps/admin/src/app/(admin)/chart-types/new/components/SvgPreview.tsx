import React from "react";

import { ChartPoint } from "../types";
import { getGridLines } from "../utils/svgGrid";

interface SvgPreviewProps {
  svgContent: string;
  paths: any[];
  points: ChartPoint[];
  previewW: number;
  previewH: number;
  svgBoxX: number;
  svgBoxY: number;
  svgBoxW: number;
  svgBoxH: number;
  handleSvgClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleSvgMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void;
  handleSvgMouseLeave: () => void;
  isSelecting?: boolean;
  selectedPathId?: string | null;
  selectedPointIndex?: number;
  selectedPointId?: string | null;
  hoveredPointId?: string | null;
  mousePosition?: { x: number; y: number } | null;
  measurementItems?: any[];
  onPointClick?: (pointId: string) => void;
}

export function SvgPreview({
  svgContent,
  paths,
  points,
  previewW,
  previewH,
  svgBoxX,
  svgBoxY,
  svgBoxW,
  svgBoxH,
  handleSvgClick,
  handleSvgMouseMove,
  handleSvgMouseLeave,
  isSelecting = false,
  selectedPathId = null,
  selectedPointIndex = 0,
  selectedPointId = null,
  hoveredPointId = null,
  mousePosition = null,
  measurementItems = [],
  onPointClick,
}: SvgPreviewProps) {
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
        onMouseMove={handleSvgMouseMove}
        onMouseLeave={handleSvgMouseLeave}
      >
        <g
          dangerouslySetInnerHTML={{
            __html: svgContent.replace(/<svg[^>]*>|<\/svg>/gi, ""),
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

        {/* 선택 중인 상태 표시 (점선만, 실선 없음) */}
        {isSelecting &&
          selectedPathId &&
          selectedPointIndex === 1 &&
          mousePosition &&
          points.map((pt) => {
            const selectedItem = measurementItems.find(
              (item) => item.id === selectedPathId
            );
            if (selectedItem?.startPoint === pt.id) {
              return (
                <line
                  key="selection-line"
                  x1={pt.x}
                  y1={pt.y}
                  x2={mousePosition.x}
                  y2={mousePosition.y}
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              );
            }
            return null;
          })}

        {/* 포인트 */}
        {points.map((pt) => {
          // 선택된 path의 시작점이면 초록색
          const isStartSelected =
            isSelecting &&
            selectedPathId &&
            selectedPointIndex === 1 &&
            measurementItems.find((item) => item.id === selectedPathId)
              ?.startPoint === pt.id;
          return (
            <circle
              key={pt.id}
              cx={pt.x}
              cy={pt.y}
              r={
                isStartSelected
                  ? 8
                  : pt.id === selectedPointId
                    ? 6
                    : pt.id === hoveredPointId
                      ? 5
                      : 4
              }
              fill={
                isStartSelected
                  ? "#22c55e"
                  : pt.id === selectedPointId
                    ? "#2563eb"
                    : pt.id === hoveredPointId
                      ? "#f59e42"
                      : "#fff"
              }
              stroke={
                isStartSelected
                  ? "#22c55e"
                  : pt.id === selectedPointId
                    ? "#2563eb"
                    : pt.id === hoveredPointId
                      ? "#f59e42"
                      : "#888"
              }
              strokeWidth={
                isStartSelected
                  ? 3
                  : pt.id === selectedPointId || pt.id === hoveredPointId
                    ? 2
                    : 1
              }
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                if (onPointClick) {
                  onPointClick(pt.id);
                }
              }}
            />
          );
        })}

        {/* 선택 중인 상태 안내 텍스트 */}
        {isSelecting && selectedPathId && (
          <text
            x={svgBoxX + 10}
            y={svgBoxY + 20}
            fontSize={12}
            fill="#2563eb"
            fontWeight="bold"
          >
            {selectedPointIndex === 0
              ? "시작점을 선택해주세요"
              : "끝점을 선택해주세요"}
          </text>
        )}

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
    </div>
  );
}
