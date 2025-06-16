import React, { useState } from "react";

import { ChartPoint, MeasurementItem, SvgPath } from "../types";
import { getSvgPreviewData } from "../utils/etc";
import { getGridLines } from "../utils/svgGrid";

interface SvgPreviewProps {
  svgContent: string;
  paths: SvgPath[];
  points: ChartPoint[];
  // previewW: number;
  // previewH: number;
  // svgBoxX: number;
  // svgBoxY: number;
  // svgBoxW: number;
  // svgBoxH: number;
  handleSvgClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  isSelecting?: boolean;
  selectedPathId?: string | null;
  selectedPointIndex?: number;
  selectedPointId?: string | null;
  measurementItems?: MeasurementItem[];
  onPointClick?: (pointId: string) => void;
}

export function SvgPreview({
  svgContent,
  paths,
  points,
  // previewW,
  // previewH,
  // svgBoxX,
  // svgBoxY,
  // svgBoxW,
  // svgBoxH,
  handleSvgClick,
  isSelecting = false,
  selectedPathId = null,
  selectedPointIndex = 0,
  selectedPointId = null,
  measurementItems = [],
  onPointClick,
}: SvgPreviewProps) {
  const { previewW, previewH, svgBoxX, svgBoxY, svgBoxW, svgBoxH } =
    getSvgPreviewData(svgContent, "", points);

  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const handlePointMouseEnter = (pointId: string) => {
    setHoveredPointId(pointId);
  };

  const handlePointMouseLeave = () => {
    setHoveredPointId(null);
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
              onMouseEnter={() => handlePointMouseEnter(pt.id)}
              onMouseLeave={handlePointMouseLeave}
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
