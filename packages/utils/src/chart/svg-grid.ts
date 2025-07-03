import { Point } from "./types";

export interface SvgPath {
  id: string;
  points: Point[];
  type: "curve" | "line";
  data: string;
  element: SVGPathElement;
}

export const numToAlpha = (n: number) => String.fromCharCode(97 + n);

export const analyzeSVGPaths = (content: string) => {
  // 서버 사이드에서는 빈 배열 반환
  if (typeof window === "undefined") {
    return [];
  }

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
  // console.log("SVG path 개수:", rawPaths.length);

  // rawPaths.forEach((p, i) => {
  //   console.log(`path[${i}] id=${p.id} d=${p.data}`);
  // });

  return rawPaths;
};

const extractPathPoints = (pathData: string): Point[] => {
  const points: Point[] = [];
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];

  let currentX = 0;
  let currentY = 0;
  let pointIndex = 0;

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
          points.push({ id: `p${pointIndex++}`, x: currentX, y: currentY });
        }
        break;

      case "L": // Line to
        if (coords.length >= 2) {
          currentX = coords[0]!;
          currentY = coords[1]!;
          points.push({ id: `p${pointIndex++}`, x: currentX, y: currentY });
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
          points.push({ id: `p${pointIndex++}`, x: currentX, y: currentY });

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
            points.push({ id: `p${pointIndex++}`, x, y });
          }

          // 끝점
          currentX = x3;
          currentY = y3;
          points.push({ id: `p${pointIndex++}`, x: currentX, y: currentY });
        }
        break;

      case "Q": // Quadratic Bezier curve
        if (coords.length >= 4) {
          const x1 = coords[0]!;
          const y1 = coords[1]!;
          const x2 = coords[2]!;
          const y2 = coords[3]!;

          // 시작점
          points.push({ id: `p${pointIndex++}`, x: currentX, y: currentY });

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
            points.push({ id: `p${pointIndex++}`, x, y });
          }

          // 끝점
          currentX = x2;
          currentY = y2;
          points.push({ id: `p${pointIndex++}`, x: currentX, y: currentY });
        }
        break;
    }
  });

  return points;
};

export const getGridPointsFromPaths = (
  paths: SvgPath[],
  threshold = 1.5
): { id: string; x: number; y: number; type: "grid"; pathId?: string }[] => {
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
  const merged: { x: number; y: number }[] = [];
  rawPoints.forEach((pt) => {
    const found = merged.find(
      (m) =>
        Math.abs(m.x - pt.x) <= threshold && Math.abs(m.y - pt.y) <= threshold
    );
    if (!found) merged.push(pt);
  });
  const xs = Array.from(new Set(merged.map((p) => Math.round(p.x)))).sort(
    (a, b) => a - b
  );
  const ys = Array.from(new Set(merged.map((p) => Math.round(p.y)))).sort(
    (a, b) => a - b
  );

  const gridPoints: {
    id: string;
    x: number;
    y: number;
    type: "grid";
    pathId?: string;
  }[] = [];

  ys.forEach((y, row) => {
    xs.forEach((x, col) => {
      gridPoints.push({
        id: `${numToAlpha(row)}${col + 1}`,
        x,
        y,
        type: "grid" as const,
        pathId: undefined,
      });
    });
  });
  return gridPoints;
};
