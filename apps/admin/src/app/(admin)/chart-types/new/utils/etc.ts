import { ChartPoint } from "../types";

// SVG 원본 크기 fallback 계산 함수 추가
export function getFallbackSvgSize(svgContent: string) {
  const matches = Array.from(
    svgContent.matchAll(/([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi)
  );
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  matches.forEach((match) => {
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

// SVG 좌표계 기준 변환값 계산
export function getSvgOriginAndSize(svgContent: string, svgViewBox: string) {
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

export const previewW = 400;
export const previewH = 350;

export const getSvgPreviewData = (
  svgContent: string,
  svgViewBox: string,
  points: ChartPoint[]
) => {
  // 미리보기 패널 크기 및 viewBox 계산
  let svgOriginX = 0,
    svgOriginY = 0,
    svgContentW = 0,
    svgContentH = 0;
  if (svgContent) {
    const { originX, originY, width, height } = getSvgOriginAndSize(
      svgContent,
      svgViewBox
    );
    svgOriginX = originX;
    svgOriginY = originY;
    svgContentW = width;
    svgContentH = height;
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

  return {
    previewW,
    previewH,
    svgBoxX,
    svgBoxY,
    svgBoxW,
    svgBoxH,
  };
};
