import { getGridPointsFromPaths } from "./svgGrid";

interface SvgPath {
  id: string;
  element: SVGPathElement;
  data: string;
  type: "line" | "curve";
  points: { x: number; y: number }[];
  matchedStartPointId?: string;
  matchedEndPointId?: string;
}

export const analyzeSVGPaths = (content: string) => {
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
  const gridPoints = getGridPointsFromPaths(rawPaths);
  //   setPoints(gridPoints);
  //   setPaths(rawPaths);
  //   calculateSVGDimensions(gridPoints);

  return { gridPoints, rawPaths };
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
