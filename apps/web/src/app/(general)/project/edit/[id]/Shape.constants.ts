export interface Shape {
  id: string;
  name: string;
  color: string;
  bgColor: string;

  render: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
    bgColor: string
  ) => void;
}

const renderVerticalLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  bgColor: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = "round";

  const centerX = x + size / 2;

  const padding = size * 0.1;

  const startY = y + size - padding;
  const endY = y + padding;

  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, size, size);

  ctx.beginPath();
  ctx.moveTo(centerX, startY);
  ctx.lineTo(centerX, endY);
  ctx.stroke();
};

const renderDiagonalLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  bgColor: string
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.lineCap = "round";

  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, size, size);

  // SVG의 비율을 참고하여 기울어진 선 그리기
  // 원본 SVG는 18x24 비율이고 약 70도 정도 기울어짐
  const padding = size * 0.1;
  const startX = x + padding;
  const startY = y + size - padding;
  const endX = x + size - padding;
  const endY = y + padding;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
};

const renderDot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  bgColor: string
) => {
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = color;
  const padding = size * 0.1;
  const radius = (size - 2 * padding) / 2;
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
};

// 간단한 다이아몬드 모양
const renderDiamond = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  bgColor: string
) => {
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = color;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const halfSize = size * 0.35;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY - halfSize); // 위
  ctx.lineTo(centerX + halfSize, centerY); // 오른쪽
  ctx.lineTo(centerX, centerY + halfSize); // 아래
  ctx.lineTo(centerX - halfSize, centerY); // 왼쪽
  ctx.closePath();
  ctx.fill();
};

export const KNITTING_SYMBOL_OBJ: Record<string, Shape> = {
  verticalLine: {
    id: "verticalLine",
    name: "겉뜨기",
    color: "#000",
    bgColor: "#fff",
    render: renderVerticalLine,
  },
  diagonalLine: {
    id: "diagonalLine",
    name: "x",
    color: "#343844",
    bgColor: "#fff",
    render: renderDiagonalLine,
  },
  dot: {
    id: "dot",
    name: "점",
    color: "#000",
    bgColor: "#fff",
    render: renderDot,
  },
  diamond: {
    id: "diamond",
    name: "다이아몬드",
    color: "#4ECDC4",
    bgColor: "#fff",
    render: renderDiamond,
  },
} as const;

export const KNITTING_SYMBOLS = Object.values(KNITTING_SYMBOL_OBJ) as Shape[];
