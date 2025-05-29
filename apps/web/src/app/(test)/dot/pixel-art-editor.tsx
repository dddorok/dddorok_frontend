import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  CSSProperties,
} from "react";

// 브러시 도구 타입 정의
const BrushTool = {
  NONE: "NONE",
  DOT: "DOT",
  ERASER: "ERASER",
  SELECT: "SELECT",
  LINE: "LINE",
} as const;

type BrushToolType = (typeof BrushTool)[keyof typeof BrushTool];

// 도형 타입 정의
interface Shape {
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

// 뜨개질 기호 정의
const KNITTING_SYMBOLS: Shape[] = [
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

// 기본 도형들
const renderCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.fillStyle = color;
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size * 0.4;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
};

const renderSquare = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.fillStyle = color;
  const squareSize = size * 0.8;
  const offset = (size - squareSize) / 2;
  ctx.fillRect(x + offset, y + offset, squareSize, squareSize);
};

const renderTriangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.fillStyle = color;
  const centerX = x + size / 2;

  ctx.beginPath();
  ctx.moveTo(centerX, y + size * 0.1);
  ctx.lineTo(x + size * 0.1, y + size * 0.9);
  ctx.lineTo(x + size * 0.9, y + size * 0.9);
  ctx.closePath();
  ctx.fill();
};

const renderDiamond = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) => {
  ctx.fillStyle = color;
  const centerX = x + size / 2;
  const centerY = y + size / 2;

  ctx.beginPath();
  ctx.moveTo(centerX, y + size * 0.1);
  ctx.lineTo(x + size * 0.9, centerY);
  ctx.lineTo(centerX, y + size * 0.9);
  ctx.lineTo(x + size * 0.1, centerY);
  ctx.closePath();
  ctx.fill();
};

const BASIC_SHAPES: Shape[] = [
  { id: "circle", name: "원", color: "#ff4444", render: renderCircle },
  { id: "square", name: "사각형", color: "#44ff44", render: renderSquare },
  { id: "triangle", name: "삼각형", color: "#4444ff", render: renderTriangle },
  {
    id: "diamond",
    name: "다이아몬드",
    color: "#ffff44",
    render: renderDiamond,
  },
];

// 픽셀 데이터 타입
interface Pixel {
  rowIndex: number;
  columnIndex: number;
  shape: Shape | null;
}

interface MousePosition {
  x: number;
  y: number;
}

interface GridPosition {
  row: number;
  col: number;
}

interface PanOffset {
  x: number;
  y: number;
}

interface SelectedArea {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

interface DottingProps {
  rows?: number;
  cols?: number;
  gridSquareLength?: number;
  gridStrokeColor?: string;
  gridStrokeWidth?: number;
  isGridVisible?: boolean;
  backgroundColor?: string;
  brushTool?: BrushToolType;
  selectedShape?: Shape;
  isPanZoomable?: boolean;
  zoomSensitivity?: number;
  isInteractionApplicable?: boolean;
  isDrawingEnabled?: boolean;
  minScale?: number;
  maxScale?: number;
  style?: CSSProperties;
  defaultPixelShape?: Shape | null;
  shapes?: Shape[]; // 외부에서 도형 리스트를 받을 수 있도록
}

interface DottingRef {
  clear: () => void;
  getPixels: () => (Pixel | null)[][];
  setPixels: (newPixels: (Pixel | null)[][]) => void;
  exportImage: () => string;
}

const createPixel = (
  rowIndex: number,
  columnIndex: number,
  shape: Shape | null = null
): Pixel => ({
  rowIndex,
  columnIndex,
  shape,
});

// 유틸리티 함수들
const interpolatePixels = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  shape: Shape | null
): Pixel[] => {
  const pixels: Pixel[] = [];
  const dx = Math.abs(endCol - startCol);
  const dy = Math.abs(endRow - startRow);
  const sx = startCol < endCol ? 1 : -1;
  const sy = startRow < endRow ? 1 : -1;
  let err = dx - dy;

  let x = startCol;
  let y = startRow;

  while (true) {
    pixels.push(createPixel(y, x, shape));

    if (x === endCol && y === endRow) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return pixels;
};

const drawLine = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  shape: Shape | null
): Pixel[] => {
  return interpolatePixels(startRow, startCol, endRow, endCol, shape);
};

// 도형 그리기 함수 (Canvas 렌더링 함수 사용으로 단순화)
const drawShape = (
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  x: number,
  y: number,
  size: number
): void => {
  shape.render(ctx, x, y, size, shape.color);
};

// Dotting 컴포넌트
const Dotting = forwardRef<DottingRef, DottingProps>(
  (
    {
      rows = 20,
      cols = 20,
      gridSquareLength = 20,
      gridStrokeColor = "#ddd",
      gridStrokeWidth = 1,
      isGridVisible = true,
      backgroundColor = "#fff",
      brushTool = BrushTool.DOT,
      selectedShape = KNITTING_SYMBOLS[0],
      isPanZoomable = true,
      zoomSensitivity = 0.1,
      isInteractionApplicable = true,
      isDrawingEnabled = true,
      minScale = 0.1,
      maxScale = 5,
      style = {},
      defaultPixelShape = null,
      shapes = KNITTING_SYMBOLS,
    },
    ref
  ) => {
    // width, height를 rows, cols, gridSquareLength로 계산
    const width = cols * gridSquareLength;
    const height = rows * gridSquareLength;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pixels, setPixels] = useState<(Pixel | null)[][]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [dragStart, setDragStart] = useState<GridPosition | null>(null);
    const [panOffset, setPanOffset] = useState<PanOffset>({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState<MousePosition | null>(
      null
    );
    const [lineStart, setLineStart] = useState<GridPosition | null>(null);
    const [previewLine, setPreviewLine] = useState<Pixel[]>([]);
    const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null);
    const [lastDrawnPos, setLastDrawnPos] = useState<GridPosition | null>(null);

    // ref를 통해 외부에서 사용할 수 있는 메서드들
    useImperativeHandle(
      ref,
      () => ({
        clear: () => setPixels([]),
        getPixels: () => pixels,
        setPixels: (newPixels: (Pixel | null)[][]) => setPixels(newPixels),
        exportImage: () => {
          const canvas = document.createElement("canvas");
          canvas.width = cols * gridSquareLength;
          canvas.height = rows * gridSquareLength;
          const ctx = canvas.getContext("2d");

          if (!ctx) return "";

          // 배경 그리기
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          return canvas.toDataURL();
        },
      }),
      [pixels, backgroundColor, cols, rows, gridSquareLength]
    );

    const getMousePos = useCallback(
      (e: React.MouseEvent): MousePosition => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - panOffset.x) / scale;
        const y = (e.clientY - rect.top - panOffset.y) / scale;
        return { x, y };
      },
      [panOffset, scale]
    );

    const getGridPos = useCallback(
      (mousePos: MousePosition): GridPosition => {
        const col = Math.floor(mousePos.x / gridSquareLength);
        const row = Math.floor(mousePos.y / gridSquareLength);
        return { row, col };
      },
      [gridSquareLength]
    );

    const setPixel = useCallback(
      (row: number, col: number, shape: Shape | null) => {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return;

        setPixels((prev) => {
          const newPixels = [...prev];
          if (!newPixels[row]) newPixels[row] = [];
          newPixels[row][col] = shape ? createPixel(row, col, shape) : null;
          return newPixels;
        });
      },
      [rows, cols]
    );

    const drawContinuousLine = useCallback(
      (
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number,
        shape: Shape | null
      ) => {
        const pixels = interpolatePixels(fromRow, fromCol, toRow, toCol, shape);
        setPixels((prev) => {
          const newPixels = [...prev];
          pixels.forEach((pixel) => {
            if (!newPixels[pixel.rowIndex]) newPixels[pixel.rowIndex] = [];
            const row = newPixels[pixel.rowIndex];
            if (row) {
              row[pixel.columnIndex] = pixel;
            }
          });
          return newPixels;
        });
      },
      []
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!isInteractionApplicable) return;

        const mousePos = getMousePos(e);
        const { row, col } = getGridPos(mousePos);

        if (brushTool === BrushTool.NONE) {
          if (isPanZoomable) {
            setIsDragging(true);
            setLastPanPoint({ x: e.clientX, y: e.clientY });
          }
          return;
        }

        if (!isDrawingEnabled) return;

        setIsDrawing(true);
        setDragStart({ row, col });
        setLastDrawnPos({ row, col });

        switch (brushTool) {
          case BrushTool.DOT:
            setPixel(row, col, selectedShape || null);
            break;
          case BrushTool.ERASER:
            setPixel(row, col, null);
            break;
          case BrushTool.LINE:
            setLineStart({ row, col });
            break;
          case BrushTool.SELECT:
            setSelectedArea({
              startRow: row,
              startCol: col,
              endRow: row,
              endCol: col,
            });
            break;
        }
      },
      [
        brushTool,
        selectedShape,
        isInteractionApplicable,
        isDrawingEnabled,
        isPanZoomable,
        getMousePos,
        getGridPos,
        setPixel,
      ]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!isInteractionApplicable) return;

        if (isDragging && isPanZoomable) {
          if (!lastPanPoint) return;
          const deltaX = e.clientX - lastPanPoint.x;
          const deltaY = e.clientY - lastPanPoint.y;
          setPanOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
          setLastPanPoint({ x: e.clientX, y: e.clientY });
          return;
        }

        if (!isDrawing || !isDrawingEnabled) return;

        const mousePos = getMousePos(e);
        const { row, col } = getGridPos(mousePos);

        switch (brushTool) {
          case BrushTool.DOT:
            // 연속적인 선 그리기로 끊김 방지
            if (
              lastDrawnPos &&
              (lastDrawnPos.row !== row || lastDrawnPos.col !== col)
            ) {
              drawContinuousLine(
                lastDrawnPos.row,
                lastDrawnPos.col,
                row,
                col,
                selectedShape || null
              );
            } else {
              setPixel(row, col, selectedShape || null);
            }
            setLastDrawnPos({ row, col });
            break;
          case BrushTool.ERASER:
            // 지우개도 연속적으로 처리
            if (
              lastDrawnPos &&
              (lastDrawnPos.row !== row || lastDrawnPos.col !== col)
            ) {
              drawContinuousLine(
                lastDrawnPos.row,
                lastDrawnPos.col,
                row,
                col,
                null
              );
            } else {
              setPixel(row, col, null);
            }
            setLastDrawnPos({ row, col });
            break;
          case BrushTool.LINE:
            if (lineStart) {
              const linePixels = drawLine(
                lineStart.row,
                lineStart.col,
                row,
                col,
                selectedShape || null
              );
              setPreviewLine(linePixels);
            }
            break;
          case BrushTool.SELECT:
            if (dragStart) {
              setSelectedArea({
                startRow: Math.min(dragStart.row, row),
                startCol: Math.min(dragStart.col, col),
                endRow: Math.max(dragStart.row, row),
                endCol: Math.max(dragStart.col, col),
              });
            }
            break;
        }
      },
      [
        brushTool,
        selectedShape,
        isInteractionApplicable,
        isDrawingEnabled,
        isDragging,
        isPanZoomable,
        isDrawing,
        lastPanPoint,
        getMousePos,
        getGridPos,
        setPixel,
        lineStart,
        dragStart,
        lastDrawnPos,
        drawContinuousLine,
      ]
    );

    const handleMouseUp = useCallback(() => {
      if (isDragging) {
        setIsDragging(false);
        setLastPanPoint(null);
        return;
      }

      if (isDrawing) {
        if (brushTool === BrushTool.LINE && previewLine.length > 0) {
          setPixels((prev) => {
            const newPixels = [...prev];
            previewLine.forEach((pixel) => {
              if (!newPixels[pixel.rowIndex]) newPixels[pixel.rowIndex] = [];
              const row = newPixels[pixel.rowIndex];
              if (row) {
                row[pixel.columnIndex] = pixel;
              }
            });
            return newPixels;
          });
          setPreviewLine([]);
        }
      }

      setIsDrawing(false);
      setDragStart(null);
      setLineStart(null);
      setLastDrawnPos(null);
    }, [isDragging, isDrawing, brushTool, previewLine]);

    const handleWheel = useCallback(
      (e: WheelEvent) => {
        if (!isPanZoomable || !isInteractionApplicable) return;

        e.preventDefault();
        const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
        setScale((prev) =>
          Math.max(minScale, Math.min(maxScale, prev + delta))
        );
      },
      [
        isPanZoomable,
        isInteractionApplicable,
        zoomSensitivity,
        minScale,
        maxScale,
      ]
    );

    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(scale, scale);

      // 배경 그리기
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // 그리드 그리기
      if (isGridVisible) {
        ctx.strokeStyle = gridStrokeColor;
        ctx.lineWidth = gridStrokeWidth;
        ctx.beginPath();

        // 수직선
        for (let i = 0; i <= cols; i++) {
          const x = i * gridSquareLength;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }

        // 수평선
        for (let i = 0; i <= rows; i++) {
          const y = i * gridSquareLength;
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }

        ctx.stroke();
      }

      // 픽셀 그리기 (동기 처리로 변경)
      for (const row of pixels) {
        if (row) {
          for (const pixel of row) {
            if (pixel && pixel.shape) {
              drawShape(
                ctx,
                pixel.shape,
                pixel.columnIndex * gridSquareLength,
                pixel.rowIndex * gridSquareLength,
                gridSquareLength
              );
            }
          }
        }
      }

      // 미리보기 라인 그리기
      if (previewLine.length > 0) {
        for (const pixel of previewLine) {
          if (pixel.shape) {
            drawShape(
              ctx,
              pixel.shape,
              pixel.columnIndex * gridSquareLength,
              pixel.rowIndex * gridSquareLength,
              gridSquareLength
            );
          }
        }
      }

      // 선택 영역 그리기
      if (selectedArea) {
        ctx.strokeStyle = "#0066ff";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          selectedArea.startCol * gridSquareLength,
          selectedArea.startRow * gridSquareLength,
          (selectedArea.endCol - selectedArea.startCol + 1) * gridSquareLength,
          (selectedArea.endRow - selectedArea.startRow + 1) * gridSquareLength
        );
        ctx.setLineDash([]);
      }

      ctx.restore();
    }, [
      pixels,
      previewLine,
      selectedArea,
      panOffset,
      scale,
      backgroundColor,
      width,
      height,
      isGridVisible,
      gridStrokeColor,
      gridStrokeWidth,
      cols,
      rows,
      gridSquareLength,
    ]);

    useEffect(() => {
      draw();
    }, [draw]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.addEventListener("wheel", handleWheel, { passive: false });
        return () => canvas.removeEventListener("wheel", handleWheel);
      }
    }, [handleWheel]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: "1px solid #ccc",
          cursor:
            brushTool === BrushTool.NONE
              ? isDragging
                ? "grabbing"
                : "grab"
              : "crosshair",
          ...style,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    );
  }
);

Dotting.displayName = "Dotting";

// 훅들
const useBrush = (ref: React.RefObject<DottingRef | null>) => {
  const changeSelectedShape = useCallback((shape: Shape) => {
    console.log("Selected shape changed to:", shape);
  }, []);

  return { changeSelectedShape };
};

const useDotting = (ref: React.RefObject<DottingRef | null>) => {
  const clear = useCallback(() => {
    if (ref.current) {
      ref.current.clear();
    }
  }, [ref]);

  const getPixels = useCallback(() => {
    if (ref.current) {
      return ref.current.getPixels();
    }
    return [];
  }, [ref]);

  const exportImage = useCallback(() => {
    if (ref.current) {
      return ref.current.exportImage();
    }
    return null;
  }, [ref]);

  return { clear, getPixels, exportImage };
};

// 도형 선택 컴포넌트
const ShapeSelector: React.FC<{
  shapes: Shape[];
  selectedShape: Shape;
  onShapeSelect: (shape: Shape) => void;
}> = ({ shapes, selectedShape, onShapeSelect }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium">도형:</label>
      <div className="flex gap-1 p-1 bg-gray-100 rounded max-w-md overflow-x-auto">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onShapeSelect(shape)}
            className={`min-w-12 h-12 rounded border-2 flex items-center justify-center text-xs font-bold transition-all ${
              selectedShape.id === shape.id
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            style={{ color: shape.color }}
            title={shape.name}
          >
            <canvas
              width={32}
              height={32}
              ref={(canvas) => {
                if (canvas) {
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.clearRect(0, 0, 32, 32);
                    shape.render(ctx, 0, 0, 32, shape.color);
                  }
                }
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// 외부 도형 추가 컴포넌트
const CustomShapeAdder: React.FC<{
  onAddShape: (shape: Shape) => void;
}> = ({ onAddShape }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shapeName, setShapeName] = useState("");
  const [shapeColor, setShapeColor] = useState("#000000");

  const handleAddShape = () => {
    if (shapeName && shapeColor) {
      const newShape: Shape = {
        id: `custom_${Date.now()}`,
        name: shapeName,
        color: shapeColor,
        render: renderCircle, // 기본값으로 원 사용
      };
      onAddShape(newShape);
      setShapeName("");
      setShapeColor("#000000");
      setIsOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
      >
        도형 추가
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">새 도형 추가</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이름</label>
                <input
                  type="text"
                  value={shapeName}
                  onChange={(e) => setShapeName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="도형 이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">색상</label>
                <input
                  type="color"
                  value={shapeColor}
                  onChange={(e) => setShapeColor(e.target.value)}
                  className="w-full h-10 border rounded"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>기본 원 모양으로 추가됩니다.</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddShape}
                disabled={!shapeName}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
              >
                추가
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 데모 컴포넌트
const PixelArtEditor: React.FC = () => {
  const [brushTool, setBrushTool] = useState<BrushToolType>(BrushTool.DOT);
  const [selectedShape, setSelectedShape] = useState<Shape>(
    KNITTING_SYMBOLS[0] || {
      id: "default",
      name: "기본",
      color: "#000000",
      render: renderKnit,
    }
  );
  const [shapes, setShapes] = useState<Shape[]>(KNITTING_SYMBOLS);
  const dottingRef = useRef<DottingRef | null>(null);
  const { clear, exportImage } = useDotting(dottingRef);

  const handleExport = () => {
    const dataUrl = exportImage();
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "knitting-pattern.png";
      link.href = dataUrl;
      link.click();
    }
  };

  const handleAddShape = (newShape: Shape) => {
    setShapes((prev) => [...prev, newShape]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">뜨개질 패턴 편집기</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="font-medium">브러시 도구:</label>
          <select
            value={brushTool}
            onChange={(e) => setBrushTool(e.target.value as BrushToolType)}
            className="border rounded px-2 py-1"
          >
            <option value={BrushTool.NONE}>없음</option>
            <option value={BrushTool.DOT}>펜</option>
            <option value={BrushTool.ERASER}>지우개</option>
            <option value={BrushTool.SELECT}>선택</option>
            <option value={BrushTool.LINE}>직선</option>
          </select>
        </div>

        <ShapeSelector
          shapes={shapes}
          selectedShape={selectedShape}
          onShapeSelect={setSelectedShape}
        />

        <CustomShapeAdder onAddShape={handleAddShape} />

        <button
          onClick={clear}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          지우기
        </button>

        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          내보내기
        </button>
      </div>

      <div className="border-2 border-gray-300 inline-block">
        <Dotting
          ref={dottingRef}
          rows={5}
          cols={4}
          gridSquareLength={30}
          brushTool={brushTool}
          selectedShape={selectedShape}
          shapes={shapes}
          backgroundColor="#f8f9fa"
          gridStrokeColor="#e9ecef"
          isPanZoomable={true}
          zoomSensitivity={0.1}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>사용법:</strong>
        </p>
        <ul className="list-disc list-inside">
          <li>펜 도구: 클릭하거나 드래그해서 선택된 뜨개질 기호로 그리기</li>
          <li>지우개 도구: 클릭하거나 드래그해서 지우기</li>
          <li>
            직선 도구: 클릭해서 시작점 설정, 드래그해서 끝점까지 직선 그리기
          </li>
          <li>선택 도구: 드래그해서 영역 선택</li>
          <li>없음 도구: 마우스 휠로 확대/축소, 드래그로 이동</li>
          <li>뜨개질 기호: 상단의 기호 버튼을 클릭해서 그릴 기호 선택</li>
          <li>도형 추가: "도형 추가" 버튼으로 커스텀 기호 추가</li>
        </ul>

        <div className="mt-2">
          <p>
            <strong>기본 뜨개질 기호:</strong>
          </p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {KNITTING_SYMBOLS.map((shape) => (
              <span
                key={shape.id}
                className="text-xs px-2 py-1 bg-gray-100 rounded"
                style={{ color: shape.color }}
              >
                {shape.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelArtEditor;
