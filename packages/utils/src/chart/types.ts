export interface Point {
  id: string;
  x: number;
  y: number;
  type?: string;
}
export interface ChartPoint {
  id: string;
  x: number;
  y: number;
  type: string;
  pathId?: string;
}

export interface ControlPoint {
  x: number;
  y: number;
}

export interface PathDefinition {
  id: string;
  points: [string, string]; // 시작점 ID, 끝점 ID
  type: "curve" | "line";
  color: string;
  name: string;
  controlPoints?: ControlPoint[];
}
