import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  CSSProperties,
} from "react";

import { KNITTING_SYMBOLS } from "./constant";

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
export const Dotting = forwardRef<DottingRef, DottingProps>(
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
