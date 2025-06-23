// 브러시 도구 타입 정의
export const BrushTool = {
  NONE: "NONE",
  DOT: "DOT",
  ERASER: "ERASER",
  SELECT: "SELECT",
  LINE: "LINE",
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

// 뜨개질 기호 Canvas 렌더링 함수들
const renderKnit = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.fillStyle = color;
  const rectHeight = size * 0.15;
  const rectY = y + (size - rectHeight) / 2;
  const rectX = x + size * 0.1;
  const rectWidth = size * 0.8;

  ctx.beginPath();
  ctx.roundRect(rectX, rectY, rectWidth, rectHeight, rectHeight / 2);
  ctx.fill();
};

const renderPurl = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.1;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size * 0.25;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

const renderYarnOver = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size * 0.35;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

const renderDecreaseLeft = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = "round";

  const padding = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(x + padding, y + padding);
  ctx.lineTo(x + size - padding, y + size - padding);
  ctx.moveTo(x + padding, y + size - padding);
  ctx.lineTo(x + size - padding, y + padding);
  ctx.stroke();
};

const renderDecreaseRight = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = "round";

  const padding = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(x + padding, y + padding);
  ctx.lineTo(x + size - padding, y + size - padding);
  ctx.moveTo(x + size - padding, y + padding);
  ctx.lineTo(x + padding, y + size - padding);
  ctx.stroke();
};

const renderCableCross = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const padding = size * 0.15;

  ctx.beginPath();
  // 위쪽 곡선
  ctx.moveTo(x + padding, centerY);
  ctx.quadraticCurveTo(centerX, y + padding, x + size - padding, centerY);
  // 아래쪽 곡선
  ctx.moveTo(x + padding, centerY);
  ctx.quadraticCurveTo(
    centerX,
    y + size - padding,
    x + size - padding,
    centerY
  );
  ctx.stroke();
};

const renderSlipStitch = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = x + size / 2;
  const padding = size * 0.15;
  const arrowSize = size * 0.15;

  ctx.beginPath();
  // 세로선
  ctx.moveTo(centerX, y + padding);
  ctx.lineTo(centerX, y + size - padding);
  // 화살표
  ctx.moveTo(x + size / 2 - arrowSize, y + padding + arrowSize);
  ctx.lineTo(centerX, y + padding);
  ctx.lineTo(x + size / 2 + arrowSize, y + padding + arrowSize);
  ctx.stroke();
};

const renderBobble = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const outerRadius = size * 0.3;
  const innerRadius = size * 0.15;

  // 바깥 원
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  ctx.fill();

  // 안쪽 원
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
  ctx.fill();
};

const renderDot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.fillStyle = color;
  const padding = size * 0.1; // 20% 패딩
  const radius = (size - 2 * padding) / 2;
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
};

// 뜨개질 기호 정의
export const KNITTING_SYMBOLS: Shape[] = [
  {
    id: "dot",
    name: "점",
    color: "#000",
    render: renderDot,
  },
  {
    id: "knit",
    name: "뜨기",
    color: "#2563eb",
    render: renderKnit,
  },
  {
    id: "purl",
    name: "날리기",
    color: "#dc2626",
    render: renderPurl,
  },
  {
    id: "yarn_over",
    name: "걸기",
    color: "#16a34a",
    render: renderYarnOver,
  },
  {
    id: "decrease_left",
    name: "왼쪽줄임",
    color: "#ca8a04",
    render: renderDecreaseLeft,
  },
  {
    id: "decrease_right",
    name: "오른쪽줄임",
    color: "#9333ea",
    render: renderDecreaseRight,
  },
  {
    id: "cable_cross",
    name: "케이블교차",
    color: "#ea580c",
    render: renderCableCross,
  },
  {
    id: "slip_stitch",
    name: "빼기",
    color: "#0891b2",
    render: renderSlipStitch,
  },
  {
    id: "bobble",
    name: "봉긋",
    color: "#be185d",
    render: renderBobble,
  },
];
