import { useState, useEffect } from "react";

import { fetchSvg } from "../action";
import { ChartPoint } from "../types";
import { getGridPointsFromPaths } from "../utils/svgGrid";

import { toast } from "@/hooks/use-toast";

interface SvgPath {
  id: string;
  element: SVGPathElement;
  data: string;
  type: "line" | "curve";
  points: { x: number; y: number }[];
  matchedStartPointId?: string;
  matchedEndPointId?: string;
}

export const useSvgContent = (props: { svg_url: string }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [paths, setPaths] = useState<SvgPath[]>([]);
  const [points, setPoints] = useState<ChartPoint[]>([]);

  const [svgDimensions, setSvgDimensions] = useState<{
    width: number;
    height: number;
    minX: number;
    minY: number;
    scale: number;
  }>({ width: 0, height: 0, minX: 0, minY: 0, scale: 1 });

  const fetchSvgContent = async () => {
    try {
      const { content } = await fetchSvg(props.svg_url);
      setSvgContent(content);

      const rawPaths = analyzeSVGPaths(content);
      setPaths(rawPaths);

      const gridPoints = getGridPointsFromPaths(rawPaths);
      setPoints(gridPoints);
      calculateSVGDimensions(gridPoints);
    } catch (error) {
      toast({
        title: "오류",
        variant: "destructive",
        description: "SVG 파일을 가져오는데 실패했습니다.",
      });
    }
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

    setSvgDimensions({ width, height, minX, minY, scale: calculatedScale });
  };

  // 컴포넌트 마운트 시 SVG 파일 가져오기
  useEffect(() => {
    fetchSvgContent();
  }, [props.svg_url]);

  return {
    svgContent,
    paths,
    points,
    svgDimensions,
  };
};

const analyzeSVGPaths = (content: string) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(content, "image/svg+xml");
  const pathElements = svgDoc.querySelectorAll("path");

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

  return rawPaths;
};

const extractPathPoints = (pathData: string): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];

  let currentX = 0;
  let currentY = 0;

  commands.forEach((command) => {
    const type = command[0];
    const coords: number[] = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n): n is number => !isNaN(n));

    switch (type) {
      case "M": // Move to
        if (coords.length >= 2) {
          currentX = coords[0]!;
          currentY = coords[1]!;
          points.push({ x: currentX, y: currentY });
        }
        break;

      case "L": // Line to
        if (coords.length >= 2) {
          currentX = coords[0]!;
          currentY = coords[1]!;
          points.push({ x: currentX, y: currentY });
        }
        break;

      case "C": // Cubic Bezier curve
        if (coords.length >= 6) {
          const x1 = coords[0]!;
          const y1 = coords[1]!;
          const x2 = coords[2]!;
          const y2 = coords[3]!;
          const x3 = coords[4]!;
          const y3 = coords[5]!;

          // 시작점
          points.push({ x: currentX, y: currentY });

          // 곡선을 더 세밀하게 표현하기 위해 중간점들 추가
          const steps = 10;
          for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const x =
              Math.pow(1 - t, 3) * currentX +
              3 * Math.pow(1 - t, 2) * t * x1 +
              3 * (1 - t) * Math.pow(t, 2) * x2 +
              Math.pow(t, 3) * x3;
            const y =
              Math.pow(1 - t, 3) * currentY +
              3 * Math.pow(1 - t, 2) * t * y1 +
              3 * (1 - t) * Math.pow(t, 2) * y2 +
              Math.pow(t, 3) * y3;
            points.push({ x, y });
          }

          // 끝점
          currentX = x3;
          currentY = y3;
          points.push({ x: currentX, y: currentY });
        }
        break;

      case "Q": // Quadratic Bezier curve
        if (coords.length >= 4) {
          const x1 = coords[0]!;
          const y1 = coords[1]!;
          const x2 = coords[2]!;
          const y2 = coords[3]!;

          // 시작점
          points.push({ x: currentX, y: currentY });

          // 곡선을 더 세밀하게 표현하기 위해 중간점들 추가
          const qSteps = 10;
          for (let i = 1; i < qSteps; i++) {
            const t = i / qSteps;
            const x =
              Math.pow(1 - t, 2) * currentX +
              2 * (1 - t) * t * x1 +
              Math.pow(t, 2) * x2;
            const y =
              Math.pow(1 - t, 2) * currentY +
              2 * (1 - t) * t * y1 +
              Math.pow(t, 2) * y2;
            points.push({ x, y });
          }

          // 끝점
          currentX = x2;
          currentY = y2;
          points.push({ x: currentX, y: currentY });
        }
        break;
    }
  });

  return points;
};
