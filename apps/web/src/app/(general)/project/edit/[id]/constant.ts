// 브러시 도구 타입 정의
export const BrushTool = {
  NONE: "NONE",
  DOT: "DOT",
  ERASER: "ERASER",
  SELECT: "SELECT",
  LINE: "LINE",
  PALETTE: "PALETTE",
} as const;

export type BrushToolType = (typeof BrushTool)[keyof typeof BrushTool];

// 도형 타입 정의
export interface Shape {
  id: string;
  name: string;
  color: string;
  render: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string
  ) => void;
}
