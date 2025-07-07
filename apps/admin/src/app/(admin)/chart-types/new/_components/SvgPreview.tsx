import { ChartPoint, SvgPath } from "@dddorok/utils";
import React, { useRef, useState } from "react";

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
  xIntervals: number[];
  yIntervals: number[];
}

export function SvgPreview({
  svgContent,
  paths,
  points,
  highlightedPathId = null,
  xIntervals = [],
  yIntervals = [],
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

  // 구간별 비율을 적용한 xs, ys 계산
  const { xs: rawXs, ys: rawYs } = getGridLines(points);
  // 누적합으로 변환된 좌표 계산
  const getScaledCoords = (coords: number[] = [], intervals: number[] = []) => {
    if (!Array.isArray(coords) || coords.length === 0) return [];
    if (coords.length === 1) return [coords[0] ?? 0];
    const result: number[] = [coords[0] ?? 0];
    for (let i = 1; i < coords.length; i++) {
      const prev = typeof result[i - 1] === "number" ? result[i - 1] : 0;
      const base =
        typeof coords[i] === "number" && typeof coords[i - 1] === "number"
          ? coords[i]! - coords[i - 1]!
          : 0;
      result.push(prev + base * (intervals[i - 1] ?? 1));
    }
    return result;
  };
  const xs = getScaledCoords(rawXs, xIntervals);
  const ys = getScaledCoords(rawYs, yIntervals);

  // path 변환을 위한 좌표 변환 함수 (구간 내에서만 비율 변환)
  const getScaledXY = (x: number, y: number) => {
    // x 변환
    let newX = x;
    let newY = y;
    // x 구간 찾기
    if (rawXs.length > 1) {
      let xIdx = rawXs.findIndex(
        (v, i) => i < rawXs.length - 1 && x >= rawXs[i] && x <= rawXs[i + 1]
      );
      if (xIdx === -1) {
        // 좌표가 구간 밖이면 가장 가까운 구간에 할당
        xIdx = x < rawXs[0] ? 0 : rawXs.length - 2;
      }
      const x0 = rawXs[xIdx],
        x1 = rawXs[xIdx + 1];
      const x0p = xs[xIdx],
        x1p = xs[xIdx + 1];
      const t = (x - x0) / (x1 - x0);
      newX = x0p + t * (x1p - x0p);
    }
    // y 구간 찾기
    if (rawYs.length > 1) {
      let yIdx = rawYs.findIndex(
        (v, i) => i < rawYs.length - 1 && y >= rawYs[i] && y <= rawYs[i + 1]
      );
      if (yIdx === -1) {
        yIdx = y < rawYs[0] ? 0 : rawYs.length - 2;
      }
      const y0 = rawYs[yIdx],
        y1 = rawYs[yIdx + 1];
      const y0p = ys[yIdx],
        y1p = ys[yIdx + 1];
      const t = (y - y0) / (y1 - y0);
      newY = y0p + t * (y1p - y0p);
    }
    return { x: Number(newX), y: Number(newY) };
  };

  // path d 파싱 및 변환 (robust 버전)
  function transformPathD(d: string) {
    const commandRegex = /([a-zA-Z])([^a-zA-Z]*)/g;
    let match;
    let result = "";
    let lastPoint = { x: 0, y: 0 };
    while ((match = commandRegex.exec(d)) !== null) {
      const [_, cmd, params] = match;
      // 항상 소문자(상대좌표) 명령어로 변환
      const relCmd = cmd.toLowerCase();
      const cmdUpper = cmd.toUpperCase();
      const numbers = params
        ? params
            .trim()
            .split(/[ ,]+/)
            .filter(Boolean)
            .map(Number)
            .filter((n) => !isNaN(n))
        : [];
      let newParams = "";
      let i = 0;
      if (["M", "L", "T"].includes(cmdUpper)) {
        while (i < numbers.length) {
          const x = numbers[i++];
          const y = numbers[i++];
          if (typeof x === "number" && typeof y === "number") {
            if (cmdUpper === "M" && result === "") {
              // 첫 M은 절대좌표로 시작해야 함
              const scaled = getScaledXY(x, y);
              newParams += `${Number(scaled.x)} ${Number(scaled.y)}`;
              lastPoint = { x: Number(scaled.x), y: Number(scaled.y) };
            } else {
              const scaled = getScaledXY(x, y);
              const dx = Number(scaled.x) - Number(lastPoint.x);
              const dy = Number(scaled.y) - Number(lastPoint.y);
              newParams += `${newParams ? " " : ""}${dx} ${dy}`;
              lastPoint = { x: Number(scaled.x), y: Number(scaled.y) };
            }
          }
        }
      } else if (["C"].includes(cmdUpper)) {
        while (i < numbers.length) {
          const x1 = numbers[i++],
            y1 = numbers[i++],
            x2 = numbers[i++],
            y2 = numbers[i++],
            x = numbers[i++],
            y = numbers[i++];
          if ([x1, y1, x2, y2, x, y].every((v) => typeof v === "number")) {
            const s1 = getScaledXY(x1, y1);
            const s2 = getScaledXY(x2, y2);
            const s = getScaledXY(x, y);
            const dx1 = Number(s1.x) - Number(lastPoint.x),
              dy1 = Number(s1.y) - Number(lastPoint.y);
            const dx2 = Number(s2.x) - Number(lastPoint.x),
              dy2 = Number(s2.y) - Number(lastPoint.y);
            const dx = Number(s.x) - Number(lastPoint.x),
              dy = Number(s.y) - Number(lastPoint.y);
            newParams += `${newParams ? " " : ""}${dx1} ${dy1} ${dx2} ${dy2} ${dx} ${dy}`;
            lastPoint = { x: Number(s.x), y: Number(s.y) };
          }
        }
      } else if (["S"].includes(cmdUpper)) {
        while (i < numbers.length) {
          const x2 = numbers[i++],
            y2 = numbers[i++],
            x = numbers[i++],
            y = numbers[i++];
          if ([x2, y2, x, y].every((v) => typeof v === "number")) {
            const s2 = getScaledXY(x2, y2);
            const s = getScaledXY(x, y);
            const dx2 = Number(s2.x) - Number(lastPoint.x),
              dy2 = Number(s2.y) - Number(lastPoint.y);
            const dx = Number(s.x) - Number(lastPoint.x),
              dy = Number(s.y) - Number(lastPoint.y);
            newParams += `${newParams ? " " : ""}${dx2} ${dy2} ${dx} ${dy}`;
            lastPoint = { x: Number(s.x), y: Number(s.y) };
          }
        }
      } else if (["Q"].includes(cmdUpper)) {
        while (i < numbers.length) {
          const x1 = numbers[i++],
            y1 = numbers[i++],
            x = numbers[i++],
            y = numbers[i++];
          if ([x1, y1, x, y].every((v) => typeof v === "number")) {
            const s1 = getScaledXY(x1, y1);
            const s = getScaledXY(x, y);
            const dx1 = Number(s1.x) - Number(lastPoint.x),
              dy1 = Number(s1.y) - Number(lastPoint.y);
            const dx = Number(s.x) - Number(lastPoint.x),
              dy = Number(s.y) - Number(lastPoint.y);
            newParams += `${newParams ? " " : ""}${dx1} ${dy1} ${dx} ${dy}`;
            lastPoint = { x: Number(s.x), y: Number(s.y) };
          }
        }
      } else if (["H"].includes(cmdUpper)) {
        while (i < numbers.length) {
          const x = numbers[i++];
          if (typeof x === "number") {
            const s = getScaledXY(x, lastPoint.y);
            const dx = Number(s.x) - Number(lastPoint.x);
            newParams += `${newParams ? " " : ""}${dx}`;
            lastPoint.x = Number(s.x);
          }
        }
      } else if (["V"].includes(cmdUpper)) {
        while (i < numbers.length) {
          const y = numbers[i++];
          if (typeof y === "number") {
            const s = getScaledXY(lastPoint.x, y);
            const dy = Number(s.y) - Number(lastPoint.y);
            newParams += `${newParams ? " " : ""}${dy}`;
            lastPoint.y = Number(s.y);
          }
        }
      } else if (["Z"].includes(cmdUpper)) {
        newParams = "";
      } else {
        newParams = params ?? "";
      }
      result += relCmd + newParams;
    }
    return result;
  }

  // SVG content를 파싱하여 path 요소들을 추출하고 스타일/좌표 변환을 적용하는 함수
  const getStyledSvgContent = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgElement = doc.documentElement;

    // 모든 path 요소에 대해 스타일 및 좌표 변환 적용
    svgElement.querySelectorAll("path").forEach((path) => {
      const pathId = path.getAttribute("id");
      // d 변환
      const d = path.getAttribute("d");
      if (d) {
        path.setAttribute("d", transformPathD(d));
      }
      if (pathId && pathId === highlightedPathId) {
        path.setAttribute("stroke", "#22c55e");
        path.setAttribute("stroke-width", "3");
      }
    });

    return svgElement.innerHTML;
  };

  // points 변환
  const scaledPoints = points.map((pt) => {
    const xIdx = rawXs.findIndex((x) => x === pt.x);
    const yIdx = rawYs.findIndex((y) => y === pt.y);
    return {
      ...pt,
      x: xs[xIdx] ?? pt.x,
      y: ys[yIdx] ?? pt.y,
    };
  });

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
          const xLabels = xs.map((x, i) => i + 1);
          const yLabels = ys.map((y, i) => String.fromCharCode(97 + i));
          return (
            <>
              {xs.map((x, i) => (
                <React.Fragment key={`vx${i}`}>
                  <line
                    x1={x}
                    y1={svgBoxY ?? 0}
                    x2={x}
                    y2={(svgBoxY ?? 0) + (svgBoxH ?? 0)}
                    stroke="#bbb"
                    strokeDasharray="4 2"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={(svgBoxY ?? 0) + 18}
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
                    y1={y ?? 0}
                    x2={(svgBoxX ?? 0) + (svgBoxW ?? 0)}
                    y2={y ?? 0}
                    stroke="#bbb"
                    strokeDasharray="4 2"
                    strokeWidth={1}
                  />
                  <text
                    x={(svgBoxX ?? 0) + 10}
                    y={(y ?? 0) + 4}
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
        {scaledPoints.map((pt) => {
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
        {scaledPoints.map((pt) =>
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
