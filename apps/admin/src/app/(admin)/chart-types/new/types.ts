export interface ChartPoint {
  id: string;
  x: number;
  y: number;
  type: string;
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
