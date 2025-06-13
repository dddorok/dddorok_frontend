export interface ChartPoint {
  id: string;
  x: number;
  y: number;
  type: "path-start" | "path-end" | "grid-intersection" | "grid";
  pathId?: string;
}
