export interface ChartPoint {
  id: string;
  x: number;
  y: number;
  type: "grid";
  pathId?: string;
}

export interface SvgPath {
  id: string;
  points: Array<{
    x: number;
    y: number;
  }>;
  type?: "curve" | "line";
  data?: string;
  element?: SVGPathElement;
}

export interface PathType {
  pathId: string;
  selectedMeasurement: string | null;
}

export type PathDataType = PathType;
