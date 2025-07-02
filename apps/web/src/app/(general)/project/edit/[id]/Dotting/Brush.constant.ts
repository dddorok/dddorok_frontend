// 브러시 도구 타입 정의
export const BrushTool = {
  NONE: "NONE",
  DOT: "DOT",
  ERASER: "ERASER",
  SELECT: "SELECT",
  LINE: "LINE",
} as const;

export type BrushToolType = (typeof BrushTool)[keyof typeof BrushTool];
