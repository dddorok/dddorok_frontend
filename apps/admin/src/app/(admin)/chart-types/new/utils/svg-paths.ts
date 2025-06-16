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
