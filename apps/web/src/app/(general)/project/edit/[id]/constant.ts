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

// 선택 배경 색 관련 상수
export const SELECTION_BACKGROUND_COLORS = {
  GREEN: "#4CAF50",
  YELLOW: "#FFC107",
  RED: "#F44336",
  ORANGE: "#FF9800",
} as const;

export type SelectionBackgroundColorType =
  (typeof SELECTION_BACKGROUND_COLORS)[keyof typeof SELECTION_BACKGROUND_COLORS];

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
