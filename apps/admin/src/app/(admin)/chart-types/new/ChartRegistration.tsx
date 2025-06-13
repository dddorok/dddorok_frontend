"use client";

import React, { useState, useRef, useEffect } from "react";

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

  // path의 start/end 좌표만 수집, 병합, 정렬, id 부여
  function getGridPointsFromPaths(paths: SvgPath[], threshold = 1.5) {
    // 1. 모든 path의 start/end 좌표 수집
    const rawPoints: { x: number; y: number }[] = [];
    paths.forEach((path) => {
      if (path.points.length > 0) {
        const startPoint = path.points[0];
        const endPoint = path.points[path.points.length - 1];
        if (startPoint && endPoint) {
          rawPoints.push(startPoint);
          rawPoints.push(endPoint);
        }
      }
    });
    // 2. ±1.5px 병합
    const merged: { x: number; y: number }[] = [];
    rawPoints.forEach((pt) => {
      const found = merged.find(
        (m) =>
          Math.abs(m.x - pt.x) <= threshold && Math.abs(m.y - pt.y) <= threshold
      );
      if (!found) merged.push(pt);
    });
    // 3. X/Y 정렬
    const xs = Array.from(new Set(merged.map((p) => Math.round(p.x)))).sort(
      (a, b) => a - b
    );
    const ys = Array.from(new Set(merged.map((p) => Math.round(p.y)))).sort(
      (a, b) => a - b
    );
    // 4. 각 교차점에 id 부여 (a1, b2 ...) - 모든 조합에 대해 ChartPoint 생성
    const gridPoints: ChartPoint[] = [];
    ys.forEach((y, row) => {
      xs.forEach((x, col) => {
        gridPoints.push({
          id: `${numToAlpha(row)}${col + 1}`,
          x,
          y,
          type: "grid",
        });
      });
    });
    return gridPoints;
  }

  function extractAllPathPoints(paths: SvgPath[]): { x: number; y: number }[] {
    const all: { x: number; y: number }[] = [];
    paths.forEach((path) => {
      if (path.points.length > 0) {
        const startPoint = path.points[0];
        const endPoint = path.points[path.points.length - 1];
        if (startPoint && endPoint) {
          all.push(startPoint);
          all.push(endPoint);
        }
      }
      const d = path.data;
      const cMatches = d.match(/[CQ]([^CQMLHVZ]+)/gi);
      if (cMatches) {
        cMatches.forEach((cmd) => {
          const coords = cmd
            .slice(1)
            .trim()
            .split(/[\s,]+/)
            .map(Number);
          for (let i = 0; i < coords.length; i += 2) {
            const x = coords[i];
            const y = coords[i + 1];
            if (
              typeof x === "number" &&
              typeof y === "number" &&
              !isNaN(x) &&
              !isNaN(y)
            ) {
              all.push({ x, y });
            }
          }
        });
      }
    });
    return all;
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

  const handlePointSelect = (
    itemId: string,
    field: "startPoint" | "endPoint"
  ) => {
    setSelectedPointField({ itemId, field });
    setIsSelecting(true);
    setSelectedMeasurementId(null); // ✅ 수동 선택 시 연결선 초기화
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

  // getGridLines에서 X/Y 좌표 병합 적용
  function getGridLines(points: ChartPoint[]) {
    const xs = mergeCoords(points.map((p) => p.x));
    const ys = mergeCoords(points.map((p) => p.y));
    return { xs, ys };
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
  const svgViewBoxStr = `${svgOriginX} ${svgOriginY} ${svgContentW} ${svgContentH}`;

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

  // 곡선의 제어점 추출 함수 추가
  function extractControlPoints(pathData: string): { x: number; y: number }[] {
    const controlPoints: { x: number; y: number }[] = [];
    const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];

    commands.forEach((command) => {
      const type = command[0];
      const coords = command
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .map(Number);

      if (type === "C") {
        // Cubic Bezier curve: C x1 y1 x2 y2 x y
        for (let i = 0; i < 4; i += 2) {
          const x = coords[i];
          const y = coords[i + 1];
          if (
            typeof x === "number" &&
            typeof y === "number" &&
            !isNaN(x) &&
            !isNaN(y)
          ) {
            controlPoints.push({ x, y });
          }
        }
      } else if (type === "Q") {
        // Quadratic Bezier curve: Q x1 y1 x y
        const x = coords[0];
        const y = coords[1];
        if (
          typeof x === "number" &&
          typeof y === "number" &&
          !isNaN(x) &&
          !isNaN(y)
        ) {
          controlPoints.push({ x, y });
        }
      }
    });

    return controlPoints;
  }

  // 타입 명시
  interface AutoMappingTableProps {
    paths: SvgPath[];
    extractControlPoints: (pathData: string) => { x: number; y: number }[];
  }
  function AutoMappingTable({
    paths,
    extractControlPoints,
  }: AutoMappingTableProps) {
    return (
      <table className="w-full border text-xs mb-2">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-2 py-1">No.</th>
            <th className="border px-2 py-1">path ID</th>
            <th className="border px-2 py-1">타입</th>
            <th className="border px-2 py-1">시작점</th>
            <th className="border px-2 py-1">끝점</th>
            <th className="border px-2 py-1">제어점</th>
          </tr>
        </thead>
        <tbody>
          {paths.map((p, i) => {
            const startPoint = p.points[0];
            const endPoint = p.points[p.points.length - 1];
            const controlPoints =
              p.type === "curve" ? extractControlPoints(p.data) : [];
            return (
              <tr key={p.id} className="text-gray-700">
                <td className="border px-2 py-1 text-center">{i + 1}</td>
                <td className="border px-2 py-1 text-blue-600 underline cursor-pointer">
                  {p.id}
                </td>
                <td className="border px-2 py-1">
                  {p.type === "line" ? "직선" : "곡선"}
                </td>
                <td className="border px-2 py-1">
                  {startPoint ? `(${startPoint.x}, ${startPoint.y})` : "-"}
                </td>
                <td className="border px-2 py-1">
                  {endPoint ? `(${endPoint.x}, ${endPoint.y})` : "-"}
                </td>
                <td className="border px-2 py-1">
                  {controlPoints.length > 0
                    ? controlPoints.map((cp) => `(${cp.x}, ${cp.y})`).join(", ")
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  // 타입 명시
  interface ManualMappingTableProps {
    measurementItems: MeasurementItem[];
    selectedPathId: string | null;
    selectedPointIndex: number;
    handlePathIdClick: (pathId: string) => void;
  }

  function ManualMappingTable({
    measurementItems,
    selectedPathId,
    selectedPointIndex,
    handlePathIdClick,
  }: ManualMappingTableProps) {
    return (
      <table className="w-full border text-xs">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-2 py-1">No.</th>
            <th className="border px-2 py-1">path ID</th>
            <th className="border px-2 py-1">측정항목</th>
            <th className="border px-2 py-1">시작점 - 번호</th>
            <th className="border px-2 py-1">끝점 - 번호</th>
            <th className="border px-2 py-1">슬라이더 조정</th>
          </tr>
        </thead>
        <tbody>
          {measurementItems.map((m, i) => (
            <tr key={m.id}>
              <td className="border px-2 py-1 text-center">{i + 1}</td>
              <td
                className={`border px-2 py-1 text-blue-600 underline cursor-pointer ${selectedPathId === m.id ? "bg-blue-50" : ""}`}
                onClick={() => handlePathIdClick(m.id)}
              >
                {m.id}
              </td>
              <td className="border px-2 py-1">{m.name}</td>
              <td className="border px-2 py-1">
                {m.startPoint ||
                  (selectedPathId === m.id && selectedPointIndex === 0
                    ? "선택 중..."
                    : "선택")}
              </td>
              <td className="border px-2 py-1">
                {m.endPoint ||
                  (selectedPathId === m.id && selectedPointIndex === 1
                    ? "선택 중..."
                    : "선택")}
              </td>
              <td className="border px-2 py-1 text-center">
                <input type="checkbox" checked={m.adjustable} readOnly />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center py-8">
      {/* 상단 타이틀만 */}
      <div className="w-[900px] flex items-center mb-4">
        <div className="text-lg font-bold">차트 유형 등록</div>
      </div>

      {/* 1. 타입/차트 정보 */}
      <div className="w-[900px] bg-white border border-gray-200 rounded mb-4 p-5">
        <div className="flex items-center mb-3">
          <span className="w-6 h-6 flex items-center justify-center bg-[#f3f4f6] rounded-full text-xs font-bold mr-2 text-blue-600">
            1
          </span>
          <span className="font-semibold text-gray-700">타입/차트 정보</span>
        </div>
        <div className="mb-2">
          {/* 업로드된 파일명 표시 */}
          {svgFileName ? (
            <div className="text-xs text-blue-700 underline w-fit">
              {svgFileName}
            </div>
          ) : (
            <div className="text-xs text-gray-400 w-fit">
              SVG 파일을 업로드 해주세요.
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            SVG에서 path 정보를 자동으로 추출할 수 있습니다.
          </div>
        </div>
        {/* 업로드 영역 */}
        <div className="flex items-center gap-8 mt-4">
          <div
            className="border-2 border-dashed border-blue-300 bg-blue-50 flex items-center justify-center"
            style={{
              width: previewW,
              height: previewH,
              position: "relative",
              cursor: "pointer",
            }}
            onClick={handleUploadAreaClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* path 개수 우측 상단 표시 */}
            {paths.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 16,
                  zIndex: 10,
                  fontSize: 13,
                  color: "#2563eb",
                  fontWeight: 600,
                }}
              >
                path 개수: {paths.length}
              </div>
            )}
            {/* SVG 한 개로 모든 요소 렌더링 */}
            {svgContent ? (
              <svg
                width={previewW}
                height={previewH}
                viewBox={`${svgBoxX} ${svgBoxY} ${svgBoxW} ${svgBoxH}`}
                style={{
                  background: "white",
                  width: previewW,
                  height: previewH,
                  display: "block",
                }}
                onClick={handleSvgClick}
                onMouseMove={handleSvgMouseMove}
                onMouseLeave={handleSvgMouseLeave}
              >
                {/* path 원본 (스타일 변환 없이 SVG 원본 그대로) */}
                <g
                  dangerouslySetInnerHTML={{
                    __html: svgContent.replace(/<svg[^>]*>|<\/svg>/gi, ""),
                  }}
                />
                {/* 그리드 선/라벨 */}
                {(() => {
                  const { xs, ys } = getGridLines(points);
                  const xLabels = xs.map((x, i) => i + 1);
                  const yLabels = ys.map((y, i) => String.fromCharCode(97 + i));
                  return (
                    <>
                      {/* 세로선(X) */}
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
                          {/* X축 라벨 */}
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
                      {/* 가로선(Y) */}
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
                          {/* Y축 라벨 */}
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
                          : pt.id === selectedPointId ||
                              pt.id === hoveredPointId
                            ? 2
                            : 1
                      }
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoveredPointId(pt.id)}
                      onMouseLeave={() => setHoveredPointId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelecting && selectedPathId) {
                          const isStartPoint = selectedPointIndex === 0;
                          const field = isStartPoint
                            ? "startPoint"
                            : "endPoint";

                          setMeasurementItems((prev) =>
                            prev.map((item) =>
                              item.id === selectedPathId
                                ? { ...item, [field]: pt.id }
                                : item
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
                        } else {
                          setSelectedPointId(pt.id);
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
                {/* 포인트 id 툴크 (hover 시) */}
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
            ) : (
              <span className="text-gray-400 text-xs text-center px-2">
                SVG 파일을 클릭 또는 드래그하여 업로드하세요.
                <br />
                (최대 10MB)
              </span>
            )}
            <input
              type="file"
              accept=".svg"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            {uploadError && (
              <div className="text-xs text-red-500 mb-2">{uploadError}</div>
            )}
          </div>
        </div>
      </div>

      {/* 2. 자동 매핑 목록 */}
      <div className="w-[900px] bg-white border border-gray-200 rounded mb-4 p-5">
        <div className="flex items-center mb-3">
          <span className="w-6 h-6 flex items-center justify-center bg-[#f3f4f6] rounded-full text-xs font-bold mr-2 text-orange-500">
            2
          </span>
          <span className="font-semibold text-gray-700">자동 매핑 목록</span>
        </div>
        <AutoMappingTable
          paths={paths}
          extractControlPoints={extractControlPoints}
        />
      </div>

      {/* 3. 관리자 수동 매핑 항목 */}
      <div className="w-[900px] bg-white border border-gray-200 rounded mb-4 p-5">
        <div className="flex items-center mb-3">
          <span className="w-6 h-6 flex items-center justify-center bg-[#f3f4f6] rounded-full text-xs font-bold mr-2 text-green-600">
            3
          </span>
          <span className="font-semibold text-gray-700">
            관리자 수동 매핑 항목
          </span>
        </div>
        <ManualMappingTable
          measurementItems={measurementItems}
          selectedPathId={selectedPathId}
          selectedPointIndex={selectedPointIndex}
          handlePathIdClick={handlePathIdClick}
        />
        <div className="text-xs text-red-500 mt-2">
          {selectedPathId && selectedPointIndex === 0
            ? "시작점을 선택해주세요."
            : selectedPathId && selectedPointIndex === 1
              ? "끝점을 선택해주세요."
              : "* 매핑되지 않은 항목이 있습니다. 모든 항목의 매핑을 완료해주세요."}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="w-[900px] flex justify-end gap-2 mt-2">
        <button className="bg-white border border-gray-300 px-4 py-2 rounded">
          취소
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          등록
        </button>
      </div>
    </div>
  );
};

export default ChartRegistration;
