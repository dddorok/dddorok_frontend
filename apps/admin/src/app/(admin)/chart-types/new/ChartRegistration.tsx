"use client";

import React, { useState, useRef, useEffect } from "react";

import { AutoMappingTable } from "./components/AutoMappingTable";
import { ManualMappingTable } from "./components/ManualMappingTable";
import { SvgPreview } from "./components/SvgPreview";
import {
  getGridPointsFromPaths,
  getGridLines,
  extractControlPoints,
} from "./utils/svgGrid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface ChartPoint {
  id: string;
  x: number;
  y: number;
  type: "path-start" | "path-end" | "grid-intersection" | "grid";
  pathId?: string;
}

export interface SvgPath {
  id: string;
  element: SVGPathElement;
  data: string;
  type: "line" | "curve";
  points: { x: number; y: number }[];
  matchedStartPointId?: string;
  matchedEndPointId?: string;
}

export interface MeasurementItem {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  adjustable: boolean;
  isMultiPath: boolean;
  baseLength?: number;
  pathIds?: string[];
}

interface PointFieldSelection {
  itemId: string;
  field: "startPoint" | "endPoint";
}

const ChartRegistration: React.FC = () => {
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<
    string | null
  >(null); // ✅ 클릭된 측정항목 ID
  const [svgContent, setSvgContent] = useState<string>("");
  const [paths, setPaths] = useState<SvgPath[]>([]);
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const [measurementItems, setMeasurementItems] = useState<MeasurementItem[]>(
    []
  );
  const [selectedPointField, setSelectedPointField] =
    useState<PointFieldSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [svgDimensions, setSvgDimensions] = useState<{
    width: number;
    height: number;
    minX: number;
    minY: number;
  }>({ width: 0, height: 0, minX: 0, minY: 0 });
  const [scale, setScale] = useState<number>(1);
  const svgRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [svgFileName, setSvgFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [svgViewBox, setSvgViewBox] = useState<string>("");
  const [svgRawWidth, setSvgRawWidth] = useState<number>(0);
  const [svgRawHeight, setSvgRawHeight] = useState<number>(0);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setMeasurementItems([
      {
        id: "BODY_SHOULDER_WIDTH",
        name: "어깨너비",
        startPoint: "",
        endPoint: "",
        adjustable: true,
        isMultiPath: false,
      },
      {
        id: "BODY_CHEST_WIDTH",
        name: "가슴너비",
        startPoint: "",
        endPoint: "",
        adjustable: true,
        isMultiPath: false,
      },
      {
        id: "BODY_WAIST_WIDTH",
        name: "허리너비",
        startPoint: "",
        endPoint: "",
        adjustable: false,
        isMultiPath: false,
      },
      {
        id: "BODY_ARM_LENGTH",
        name: "팔길이",
        startPoint: "",
        endPoint: "",
        adjustable: true,
        isMultiPath: true,
      },
    ]);

    // 기본 SVG 설정
    const defaultSvg = `<svg width="123" height="263" viewBox="0 0 123 263" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="&#236;&#133;&#139;&#236;&#157;&#184;&#237;&#152;&#149; &#235;&#146;&#183;&#235;&#170;&#184;&#237;&#140;&#144;">
<path id="BODY_HEM_WIDTH" d="M3 260H120" stroke="black"/>
<path id="BODY_WAIST_SLOPE_LENGTH" d="M120 260L120 111" stroke="black"/>
<path id="BODY_BACK_ARMHOLE_CIRCUMFERENCE" d="M86 63C87 97 108 107.5 120 111" stroke="black"/>
<path id="BODY_BACK_ARMHOLE_CIRCUMFERENCE_2" d="M86 63V15" stroke="black"/>
<path id="BODY_SHOULDER_SLOPE_WIDTH" d="M86 15L45 3" stroke="black"/>
<path id="BODY_BACK_NECK_CIRCUMFERENCE" d="M3 12H37C42.5 12 45 3 45 3" stroke="black"/>
</g>
</svg>`;
    setSvgContent(defaultSvg);
    analyzeSVGPaths(defaultSvg);
  }, []);

  const handleFileUpload = (event: any) => {
    let file: File | undefined;
    if (event.dataTransfer) {
      file = event.dataTransfer.files?.[0];
    } else {
      file = event.target.files?.[0];
    }
    if (!file) return;
    if (file.type !== "image/svg+xml") {
      setUploadError("SVG 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("10MB 이하의 SVG 파일만 업로드할 수 있습니다.");
      return;
    }
    setUploadError("");
    setSvgFileName(file.name);
    setSvgContent("");
    setPaths([]);
    setPoints([]);
    // 기존 정보 리셋
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setSvgContent(content);
        analyzeSVGPaths(content);
      }
    };
    reader.readAsText(file);
    // input value 리셋
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileUpload(e);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const snapToNearestChartPoint = (
    point: { x: number; y: number },
    chartPoints: ChartPoint[],
    threshold = 4
  ): ChartPoint | null => {
    let closest: ChartPoint | null = null;
    let minDist = Infinity;
    for (const pt of chartPoints) {
      const dx = pt.x - point.x;
      const dy = pt.y - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist && dist <= threshold) {
        minDist = dist;
        closest = pt;
      }
    }
    return closest;
  };

  // 알파벳 변환 함수
  function numToAlpha(n: number) {
    return String.fromCharCode(97 + n); // 0 -> 'a', 1 -> 'b', ...
  }

  const analyzeSVGPaths = (content: string) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(content, "image/svg+xml");
    const pathElements = svgDoc.querySelectorAll("path");
    const svgEl = svgDoc.querySelector("svg");
    const viewBox = svgEl?.getAttribute("viewBox") || "";
    const width = svgEl?.getAttribute("width");
    const height = svgEl?.getAttribute("height");
    let rawW = 0,
      rawH = 0;
    if (viewBox) {
      const [, , w, h] = viewBox.split(/\s+/).map(Number);
      if (
        typeof w === "number" &&
        typeof h === "number" &&
        !isNaN(w) &&
        !isNaN(h)
      ) {
        rawW = w;
        rawH = h;
      }
    } else if (width && height) {
      rawW = parseFloat(width);
      rawH = parseFloat(height);
    }
    setSvgViewBox(viewBox);
    setSvgRawWidth(rawW);
    setSvgRawHeight(rawH);
    const rawPaths: SvgPath[] = Array.from(pathElements).map((path, index) => {
      const d = path.getAttribute("d") ?? "";
      const pathId = path.getAttribute("id") || `path-${index}`;
      const isLine = d.includes("L") && !d.includes("C") && !d.includes("Q");
      const rawPoints = extractPathPoints(d);
      return {
        id: pathId,
        element: path,
        data: d,
        type: isLine ? "line" : "curve",
        points: rawPoints,
      };
    });
    // 디버깅: path 개수 및 d 속성 출력
    console.log("SVG path 개수:", rawPaths.length);
    rawPaths.forEach((p, i) => {
      console.log(`path[${i}] id=${p.id} d=${p.data}`);
    });
    const gridPoints = getGridPointsFromPaths(rawPaths);
    setPoints(gridPoints);
    setPaths(rawPaths);
    calculateSVGDimensions(gridPoints);
  };

  const extractPathPoints = (pathData: string): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [];
    const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
    commands.forEach((command) => {
      const type = command[0];
      const coords = command
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      if (type === "M" || type === "L") {
        for (let i = 0; i < coords.length; i += 2) {
          const x = coords[i];
          const y = coords[i + 1];
          if (
            typeof x === "number" &&
            typeof y === "number" &&
            !isNaN(x) &&
            !isNaN(y)
          ) {
            points.push({ x, y });
          }
        }
      }
    });
    return points;
  };

  const generatePoints = (pathData: SvgPath[]): ChartPoint[] => {
    const allPoints: ChartPoint[] = [];
    let pointId = 1;

    pathData.forEach((path) => {
      if (path.points.length > 0) {
        const startPoint = path.points[0];
        const last = path.points[path.points.length - 1];
        if (startPoint && last) {
          allPoints.push({
            id: `P${pointId++}`,
            x: startPoint.x,
            y: startPoint.y,
            type: "path-start",
            pathId: path.id,
          });
          if (last.x !== startPoint.x || last.y !== startPoint.y) {
            allPoints.push({
              id: `P${pointId++}`,
              x: last.x,
              y: last.y,
              type: "path-end",
              pathId: path.id,
            });
          }
        }
      }
    });

    const uniqueX = [...new Set(allPoints.map((p) => p.x))];
    const uniqueY = [...new Set(allPoints.map((p) => p.y))];
    uniqueX.forEach((x) => {
      uniqueY.forEach((y) => {
        const exists = allPoints.find(
          (p) => Math.abs(p.x - x) < 2 && Math.abs(p.y - y) < 2
        );
        if (!exists) {
          allPoints.push({
            id: `P${pointId++}`,
            x,
            y,
            type: "grid-intersection",
          });
        }
      });
    });

    setPoints(allPoints);
    return allPoints;
  };

  const calculateSVGDimensions = (allPoints: ChartPoint[]) => {
    if (allPoints.length === 0) return;
    const xCoords = allPoints.map((p) => p.x);
    const yCoords = allPoints.map((p) => p.y);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);
    const width = maxX - minX;
    const height = maxY - minY;

    const containerWidth = 560;
    const containerHeight = 384;
    const padding = 40;
    const scaleX = (containerWidth - padding * 2) / width;
    const scaleY = (containerHeight - padding * 2) / height;
    const calculatedScale = Math.min(scaleX, scaleY, 1);

    setSvgDimensions({ width, height, minX, minY });
    setScale(calculatedScale);
  };

  const handlePathIdClick = (pathId: string) => {
    setSelectedPathId(pathId);
    setSelectedPointIndex(0);
    setIsSelecting(true);
    toast({ title: "시작점 선택 중입니다." });
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isSelecting || !selectedPathId) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - rect.left) / scale + svgDimensions.minX;
    const offsetY = (e.clientY - rect.top) / scale + svgDimensions.minY;

    const selectedPath = paths.find((p) => p.id === selectedPathId);
    if (!selectedPath) return;

    let closest: ChartPoint | null = null;
    let minDist = Infinity;
    for (const pt of points) {
      const dist = Math.sqrt((pt.x - offsetX) ** 2 + (pt.y - offsetY) ** 2);
      if (dist < 10 && dist < minDist) {
        closest = pt;
        minDist = dist;
      }
    }

    if (closest) {
      // 현재 선택된 점이 시작점인지 끝점인지 확인
      const isStartPoint = selectedPointIndex === 0;
      const field = isStartPoint ? "startPoint" : "endPoint";

      setMeasurementItems((prev) =>
        prev.map((item) =>
          item.id === selectedPathId ? { ...item, [field]: closest.id } : item
        )
      );

      // 다음 점 선택을 위해 인덱스 증가
      if (isStartPoint) {
        setSelectedPointIndex(1);
        toast({ title: "끝점 선택 중입니다." });
      } else {
        // 모든 점이 선택되었으면 초기화
        setSelectedPathId(null);
        setSelectedPointIndex(0);
        setIsSelecting(false);
        setMousePosition(null);
        toast({ title: "끝점 선택 완료!" });
      }
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isSelecting || !selectedPathId) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - rect.left) / scale + svgDimensions.minX;
    const offsetY = (e.clientY - rect.top) / scale + svgDimensions.minY;
    setMousePosition({ x: offsetX, y: offsetY });
  };

  const handleSvgMouseLeave = () => {
    setMousePosition(null);
  };

  // SVG 원본 크기 fallback 계산 함수 추가
  function getFallbackSvgSize(svgContent: string) {
    const matches = Array.from(
      svgContent.matchAll(/([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi)
    );
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    matches.forEach((match) => {
      const type = match[1];
      const coords =
        match[2]
          ?.trim()
          .split(/[\s,]+/)
          .map(Number)
          .filter((n) => !isNaN(n)) || [];
      for (let i = 0; i < coords.length; i += 2) {
        const x = coords[i];
        const y = coords[i + 1];
        if (
          typeof x === "number" &&
          typeof y === "number" &&
          !isNaN(x) &&
          !isNaN(y)
        ) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    });
    if (
      minX === Infinity ||
      minY === Infinity ||
      maxX === -Infinity ||
      maxY === -Infinity
    ) {
      return { width: 200, height: 160 };
    }
    return { width: maxX - minX, height: maxY - minY };
  }

  // 좌표 병합 함수(±1.5px 이내)
  function mergeCoords(coords: number[], threshold = 1.5) {
    const sorted = [...coords].sort((a, b) => a - b);
    const merged: number[] = [];
    sorted.forEach((val) => {
      const lastVal = merged[merged.length - 1];
      if (
        merged.length === 0 ||
        (typeof lastVal === "number" && Math.abs(lastVal - val) > threshold)
      ) {
        merged.push(val);
      }
    });
    return merged;
  }

  // SVG 좌표계 기준 변환값 계산
  function getSvgOriginAndSize(
    svgContent: string,
    svgViewBox: string,
    svgRawWidth: number,
    svgRawHeight: number
  ) {
    if (svgViewBox) {
      const [vx, vy, vw, vh] = svgViewBox.split(/\s+/).map(Number);
      if (
        typeof vx === "number" &&
        typeof vy === "number" &&
        typeof vw === "number" &&
        typeof vh === "number" &&
        !isNaN(vx) &&
        !isNaN(vy) &&
        !isNaN(vw) &&
        !isNaN(vh)
      ) {
        return { originX: vx, originY: vy, width: vw, height: vh };
      }
    }
    // fallback: path bounding box
    const fallback = getFallbackSvgSize(svgContent);
    return {
      originX: 0,
      originY: 0,
      width: fallback.width,
      height: fallback.height,
    };
  }

  // 미리보기 패널 크기 및 viewBox 계산
  const previewW = 400;
  const previewH = 350;
  let svgOriginX = 0,
    svgOriginY = 0,
    svgContentW = svgRawWidth,
    svgContentH = svgRawHeight;
  if (svgContent) {
    const { originX, originY, width, height } = getSvgOriginAndSize(
      svgContent,
      svgViewBox,
      svgRawWidth,
      svgRawHeight
    );
    svgOriginX = originX;
    svgOriginY = originY;
    svgContentW = width;
    svgContentH = height;
  }

  // SVG 원본을 패널 내에서 85%만 차지하도록 scale/offset 계산
  const svgFitRatio = 0.85;
  let svgScale = 1,
    svgOffsetX = 0,
    svgOffsetY = 0;
  if (svgContentW && svgContentH) {
    const scaleW = (previewW * svgFitRatio) / svgContentW;
    const scaleH = (previewH * svgFitRatio) / svgContentH;
    svgScale = Math.min(scaleW, scaleH);
    svgOffsetX = (previewW - svgContentW * svgScale) / 2;
    svgOffsetY = (previewH - svgContentH * svgScale) / 2;
  }

  // 좌표 변환: SVG 좌표(x, y) → 미리보기 패널(0~400, 0~350) 좌표
  function svgToPanel(
    x: number,
    y: number,
    svgOriginX: number,
    svgOriginY: number,
    svgContentW: number,
    svgContentH: number,
    previewW: number,
    previewH: number
  ) {
    const px = ((x - svgOriginX) / svgContentW) * previewW;
    const py = ((y - svgOriginY) / svgContentH) * previewH;
    return { px, py };
  }

  // <style> 태그에서 path의 stroke 값을 추출해 각 path에 직접 stroke 속성을 추가(fill="none"은 그대로)
  function forcePathFillNoneAndInlineStroke(svg: string): string {
    let styleStroke = null;
    const styleMatch = svg.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch && styleMatch[1]) {
      const strokeMatch = styleMatch[1].match(/path\s*\{[^}]*stroke:([^;]+);/i);
      if (strokeMatch && strokeMatch[1]) {
        styleStroke = strokeMatch[1].trim();
      }
    }
    // 2. 각 path에 fill, stroke 속성 적용
    return svg.replace(/<path([^>]*)>/gi, (m, attrs) => {
      let newAttrs = attrs;
      if (/fill=/i.test(newAttrs)) {
        newAttrs = newAttrs.replace(/fill=["'][^"']*["']/i, 'fill="none"');
      } else {
        newAttrs += ' fill="none"';
      }
      if (!/stroke=/i.test(newAttrs) && styleStroke) {
        newAttrs += ` stroke="${styleStroke}"`;
      }
      return `<path${newAttrs}>`;
    });
  }

  // 미리보기 패널 SVG viewBox 계산 (여백 포함)
  const previewPadding = 30;
  const allX = points.map((p) => p.x);
  const allY = points.map((p) => p.y);
  const minX = Math.min(...allX, svgOriginX);
  const maxX = Math.max(...allX, svgOriginX + svgContentW);
  const minY = Math.min(...allY, svgOriginY);
  const maxY = Math.max(...allY, svgOriginY + svgContentH);
  const svgBoxX = minX - previewPadding;
  const svgBoxY = minY - previewPadding;
  const svgBoxW = maxX - minX + previewPadding * 2;
  const svgBoxH = maxY - minY + previewPadding * 2;

  const handlePointClick = (pointId: string) => {
    if (!isSelecting || !selectedPathId) {
      setSelectedPointId(pointId);
      return;
    }

    const isStartPoint = selectedPointIndex === 0;
    const field = isStartPoint ? "startPoint" : "endPoint";

    setMeasurementItems((prev) =>
      prev.map((item) =>
        item.id === selectedPathId ? { ...item, [field]: pointId } : item
      )
    );

    if (isStartPoint) {
      setSelectedPointIndex(1);
      toast({ title: "끝점 선택 중입니다." });
    } else {
      setSelectedPathId(null);
      setSelectedPointIndex(0);
      setIsSelecting(false);
      setMousePosition(null);
      toast({ title: "끝점 선택 완료!" });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">차트 유형 등록</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">1</Badge>
            타입/차트 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {svgFileName ? (
                  <Label className="text-blue-700 underline">
                    {svgFileName}
                  </Label>
                ) : (
                  <Label className="text-muted-foreground">
                    SVG 파일을 업로드 해주세요.
                  </Label>
                )}
                <p className="text-sm text-muted-foreground">
                  SVG에서 path 정보를 자동으로 추출할 수 있습니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".svg"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {svgFileName ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSvgContent("");
                        setSvgFileName("");
                        setPaths([]);
                        setPoints([]);
                        setUploadError("");
                      }}
                    >
                      파일 삭제
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      파일 변경
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    파일 업로드
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div
                className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center"
                style={{
                  width: previewW,
                  height: previewH,
                  position: "relative",
                  cursor: svgContent ? "default" : "pointer",
                }}
                onClick={!svgContent ? handleUploadAreaClick : undefined}
                onDrop={!svgContent ? handleDrop : undefined}
                onDragOver={!svgContent ? handleDragOver : undefined}
              >
                {svgContent ? (
                  <SvgPreview
                    svgContent={svgContent}
                    paths={paths}
                    points={points}
                    previewW={previewW}
                    previewH={previewH}
                    svgBoxX={svgBoxX}
                    svgBoxY={svgBoxY}
                    svgBoxW={svgBoxW}
                    svgBoxH={svgBoxH}
                    handleSvgClick={handleSvgClick}
                    handleSvgMouseMove={handleSvgMouseMove}
                    handleSvgMouseLeave={handleSvgMouseLeave}
                    isSelecting={isSelecting}
                    selectedPathId={selectedPathId}
                    selectedPointIndex={selectedPointIndex}
                    selectedPointId={selectedPointId}
                    hoveredPointId={hoveredPointId}
                    mousePosition={mousePosition}
                    measurementItems={measurementItems}
                    onPointClick={handlePointClick}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-muted-foreground text-sm text-center px-2">
                      SVG 파일을 클릭 또는 드래그하여 업로드하세요.
                      <br />
                      (최대 10MB)
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      파일 업로드
                    </Button>
                  </div>
                )}
              </div>
              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">2</Badge>
            자동 매핑 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AutoMappingTable
            paths={paths}
            extractControlPoints={extractControlPoints}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">3</Badge>
            관리자 수동 매핑 항목
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ManualMappingTable
            measurementItems={measurementItems}
            selectedPathId={selectedPathId}
            selectedPointIndex={selectedPointIndex}
            handlePathIdClick={handlePathIdClick}
          />
          <p className="text-sm text-destructive mt-2">
            {selectedPathId && selectedPointIndex === 0
              ? "시작점을 선택해주세요."
              : selectedPathId && selectedPointIndex === 1
                ? "끝점을 선택해주세요."
                : "* 매핑되지 않은 항목이 있습니다. 모든 항목의 매핑을 완료해주세요."}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">취소</Button>
        <Button>등록</Button>
      </div>
    </div>
  );
};

export default ChartRegistration;
