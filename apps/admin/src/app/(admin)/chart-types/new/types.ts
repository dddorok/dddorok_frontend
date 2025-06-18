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
