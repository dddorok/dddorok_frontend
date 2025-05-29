import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  CSSProperties,
} from "react";

import { KNITTING_SYMBOLS, BrushTool, BrushToolType, Shape } from "./constant";

// 픽셀 데이터 타입
interface Pixel {
  rowIndex: number;
  columnIndex: number;
  shape: Shape | null;
  disabled?: boolean; // 비활성화 셀 여부
}

// 히스토리용 픽셀 데이터 타입 (shape를 ID로만 저장)
interface HistoryPixel {
  rowIndex: number;
  columnIndex: number;
  shapeId: string | null;
  disabled?: boolean; // 비활성화 셀 여부
}

// 초기 셀 데이터 타입
interface InitialCellData {
  row: number;
  col: number;
  shape?: Shape | null;
  disabled?: boolean;
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
  initialCells?: InitialCellData[]; // 초기 선택된 셀 데이터
  disabledCells?: { row: number; col: number }[]; // 초기 비활성화 셀 데이터
  disabledCellColor?: string; // 비활성화 셀 색상
}

interface DottingRef {
  clear: () => void;
  getPixels: () => (Pixel | null)[][];
  setPixels: (newPixels: (Pixel | null)[][]) => void;
  exportImage: () => string;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const createPixel = (
  rowIndex: number,
  columnIndex: number,
  shape: Shape | null = null,
  disabled: boolean = false
): Pixel => ({
  rowIndex,
  columnIndex,
  shape,
  disabled,
});

// 유틸리티 함수들
const interpolatePixels = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  shape: Shape | null,
  disabled: boolean = false
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
    pixels.push(createPixel(y, x, shape, disabled));

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
  shape: Shape | null,
  disabled: boolean = false
): Pixel[] => {
  return interpolatePixels(startRow, startCol, endRow, endCol, shape, disabled);
};

// 비활성화 셀 체크 및 필터링 유틸리티 함수들
const isValidPosition = (
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean => {
  return row >= 0 && row < rows && col >= 0 && col < cols;
};

const isCellDisabled = (
  row: number,
  col: number,
  pixels: (Pixel | null)[][]
): boolean => {
  const existingPixel = pixels[row]?.[col];
  return existingPixel?.disabled || false;
};

const canDrawOnCell = (
  row: number,
  col: number,
  rows: number,
  cols: number,
  pixels: (Pixel | null)[][]
): boolean => {
  return (
    isValidPosition(row, col, rows, cols) && !isCellDisabled(row, col, pixels)
  );
};

const filterDrawablePixels = (
  pixelsToFilter: Pixel[],
  rows: number,
  cols: number,
  currentPixels: (Pixel | null)[][]
): Pixel[] => {
  return pixelsToFilter.filter((pixel) =>
    canDrawOnCell(pixel.rowIndex, pixel.columnIndex, rows, cols, currentPixels)
  );
};

const applyPixelWithDisabledCheck = (
  newPixels: (Pixel | null)[][],
  row: number,
  col: number,
  shape: Shape | null,
  rows: number,
  cols: number
): void => {
  if (!canDrawOnCell(row, col, rows, cols, newPixels)) return;

  if (!newPixels[row]) newPixels[row] = [];
  const targetRow = newPixels[row];
  if (targetRow) {
    const existingDisabled = targetRow[col]?.disabled || false;
    targetRow[col] = shape
      ? createPixel(row, col, shape, existingDisabled)
      : existingDisabled
        ? createPixel(row, col, null, true)
        : null;
  }
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

// 초기 픽셀 데이터를 생성하는 함수
const createInitialPixels = (
  rows: number,
  cols: number,
  initialCells: InitialCellData[],
  disabledCells: { row: number; col: number }[]
): (Pixel | null)[][] => {
  const pixels: (Pixel | null)[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));

  // 비활성화 셀 설정
  disabledCells.forEach(({ row, col }) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      pixels[row]![col] = createPixel(row, col, null, true);
    }
  });

  // 초기 선택된 셀 설정
  initialCells.forEach(({ row, col, shape, disabled }) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      pixels[row]![col] = createPixel(
        row,
        col,
        shape || null,
        disabled || false
      );
    }
  });

  return pixels;
};

// 히스토리 관련 유틸리티 함수들
const convertPixelToHistory = (pixel: Pixel): HistoryPixel => ({
  rowIndex: pixel.rowIndex,
  columnIndex: pixel.columnIndex,
  shapeId: pixel.shape?.id || null,
  disabled: pixel.disabled || false,
});

const convertHistoryToPixel = (
  historyPixel: HistoryPixel,
  getShapeById: (id: string | null) => Shape | null
): Pixel => ({
  rowIndex: historyPixel.rowIndex,
  columnIndex: historyPixel.columnIndex,
  shape: getShapeById(historyPixel.shapeId),
  disabled: historyPixel.disabled || false,
});

const convertPixelsToHistory = (
  pixels: (Pixel | null)[][]
): (HistoryPixel | null)[][] => {
  return pixels.map((row) =>
    row ? row.map((pixel) => (pixel ? convertPixelToHistory(pixel) : null)) : []
  );
};

const convertHistoryToPixels = (
  historyPixels: (HistoryPixel | null)[][],
  getShapeById: (id: string | null) => Shape | null
): (Pixel | null)[][] => {
  return historyPixels.map((row) =>
    row
      ? row.map((historyPixel) =>
          historyPixel
            ? convertHistoryToPixel(historyPixel, getShapeById)
            : null
        )
      : []
  );
};

const createHistoryEntry = (
  pixels: (Pixel | null)[][]
): (HistoryPixel | null)[][] => {
  return convertPixelsToHistory(pixels);
};

const trimHistoryIfNeeded = (
  history: (HistoryPixel | null)[][][],
  maxSize: number = 50
): { trimmedHistory: (HistoryPixel | null)[][][]; newIndex: number } => {
  if (history.length <= maxSize) {
    return { trimmedHistory: history, newIndex: history.length - 1 };
  }

  const trimmedHistory = history.slice(-maxSize);
  return { trimmedHistory, newIndex: trimmedHistory.length - 1 };
};

const addToHistory = (
  currentHistory: (HistoryPixel | null)[][][],
  historyIndex: number,
  newEntry: (HistoryPixel | null)[][]
): { newHistory: (HistoryPixel | null)[][][]; newIndex: number } => {
  // 현재 인덱스 이후의 히스토리 제거
  const newHistory = currentHistory.slice(0, historyIndex + 1);
  newHistory.push(newEntry);

  // 히스토리 크기 제한
  const { trimmedHistory, newIndex } = trimHistoryIfNeeded(newHistory);

  return { newHistory: trimmedHistory, newIndex };
};

const initializeHistory = (
  initialPixels: (Pixel | null)[][]
): (HistoryPixel | null)[][][] => {
  const initialHistoryData = createHistoryEntry(initialPixels);
  return [initialHistoryData];
};

const canUndoHistory = (historyIndex: number): boolean => historyIndex > 0;

const canRedoHistory = (historyIndex: number, historyLength: number): boolean =>
  historyIndex < historyLength - 1;

const executeUndo = (
  history: (HistoryPixel | null)[][][],
  historyIndex: number,
  getShapeById: (id: string | null) => Shape | null
): { pixels: (Pixel | null)[][]; newIndex: number } | null => {
  if (!canUndoHistory(historyIndex)) return null;

  const prevHistoryPixels = history[historyIndex - 1];
  if (!prevHistoryPixels) return null;

  const pixels = convertHistoryToPixels(prevHistoryPixels, getShapeById);
  return { pixels, newIndex: historyIndex - 1 };
};

const executeRedo = (
  history: (HistoryPixel | null)[][][],
  historyIndex: number,
  getShapeById: (id: string | null) => Shape | null
): { pixels: (Pixel | null)[][]; newIndex: number } | null => {
  if (!canRedoHistory(historyIndex, history.length)) return null;

  const nextHistoryPixels = history[historyIndex + 1];
  if (!nextHistoryPixels) return null;

  const pixels = convertHistoryToPixels(nextHistoryPixels, getShapeById);
  return { pixels, newIndex: historyIndex + 1 };
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
      initialCells = [],
      disabledCells = [],
      disabledCellColor = "#f0f0f0",
    },
    ref
  ) => {
    // width, height를 rows, cols, gridSquareLength로 계산
    const width = cols * gridSquareLength;
    const height = rows * gridSquareLength;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pixels, setPixels] = useState<(Pixel | null)[][]>(() =>
      createInitialPixels(rows, cols, initialCells, disabledCells)
    );

    // 히스토리 관리를 위한 상태들 (개선된 유틸리티 함수 사용)
    const [history, setHistory] = useState<(HistoryPixel | null)[][][]>(() => {
      const initialPixels = createInitialPixels(
        rows,
        cols,
        initialCells,
        disabledCells
      );
      return initializeHistory(initialPixels);
    });
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isApplyingHistory, setIsApplyingHistory] = useState(false);

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

    // shape ID로 실제 shape 객체를 찾는 함수
    const getShapeById = useCallback(
      (shapeId: string | null): Shape | null => {
        if (!shapeId) return null;
        return shapes.find((shape) => shape.id === shapeId) || null;
      },
      [shapes]
    );

    // 픽셀 상태를 히스토리에 저장하는 함수 (개선된 유틸리티 사용)
    const saveToHistory = useCallback(
      (newPixels: (Pixel | null)[][]) => {
        if (isApplyingHistory) return;

        const historyEntry = createHistoryEntry(newPixels);

        setHistory((prev) => {
          // 첫 번째 히스토리가 비어있다면 현재 상태로 교체
          if (prev.length === 1 && prev[0] && prev[0].length === 0) {
            setHistoryIndex(0);
            return [historyEntry];
          }

          const { newHistory, newIndex } = addToHistory(
            prev,
            historyIndex,
            historyEntry
          );
          setHistoryIndex(newIndex);
          return newHistory;
        });
      },
      [historyIndex, isApplyingHistory]
    );

    // undo 함수 (개선된 유틸리티 사용)
    const undo = useCallback(() => {
      const result = executeUndo(history, historyIndex, getShapeById);
      if (result) {
        setIsApplyingHistory(true);
        setPixels(result.pixels);
        setHistoryIndex(result.newIndex);
        setTimeout(() => setIsApplyingHistory(false), 0);
      }
    }, [history, historyIndex, getShapeById]);

    // redo 함수 (개선된 유틸리티 사용)
    const redo = useCallback(() => {
      const result = executeRedo(history, historyIndex, getShapeById);
      if (result) {
        setIsApplyingHistory(true);
        setPixels(result.pixels);
        setHistoryIndex(result.newIndex);
        setTimeout(() => setIsApplyingHistory(false), 0);
      }
    }, [history, historyIndex, getShapeById]);

    // undo/redo 가능 여부 확인 함수들 (개선된 유틸리티 사용)
    const canUndo = useCallback(
      () => canUndoHistory(historyIndex),
      [historyIndex]
    );

    const canRedo = useCallback(
      () => canRedoHistory(historyIndex, history.length),
      [historyIndex, history.length]
    );

    // ref를 통해 외부에서 사용할 수 있는 메서드들
    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          const newPixels: (Pixel | null)[][] = [];
          setPixels(newPixels);
          saveToHistory(newPixels);
        },
        getPixels: () => pixels,
        setPixels: (newPixels: (Pixel | null)[][]) => {
          setPixels(newPixels);
          saveToHistory(newPixels);
        },
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
        undo,
        redo,
        canUndo,
        canRedo,
      }),
      [
        pixels,
        backgroundColor,
        cols,
        rows,
        gridSquareLength,
        undo,
        redo,
        canUndo,
        canRedo,
        saveToHistory,
      ]
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
        if (!canDrawOnCell(row, col, rows, cols, pixels)) return;

        setPixels((prev) => {
          const newPixels = [...prev];
          applyPixelWithDisabledCheck(newPixels, row, col, shape, rows, cols);
          return newPixels;
        });
      },
      [rows, cols, pixels]
    );

    const drawContinuousLine = useCallback(
      (
        fromRow: number,
        fromCol: number,
        toRow: number,
        toCol: number,
        shape: Shape | null
      ) => {
        const linePixels = interpolatePixels(
          fromRow,
          fromCol,
          toRow,
          toCol,
          shape
        );
        const drawablePixels = filterDrawablePixels(
          linePixels,
          rows,
          cols,
          pixels
        );

        setPixels((prev) => {
          const newPixels = [...prev];
          drawablePixels.forEach((pixel) => {
            applyPixelWithDisabledCheck(
              newPixels,
              pixel.rowIndex,
              pixel.columnIndex,
              pixel.shape,
              rows,
              cols
            );
          });
          return newPixels;
        });
      },
      [rows, cols, pixels]
    );

    // 그리기 완료 시 히스토리 저장
    const saveDrawingToHistory = useCallback(() => {
      if (!isApplyingHistory) {
        setTimeout(() => {
          saveToHistory(pixels);
        }, 0);
      }
    }, [pixels, saveToHistory, isApplyingHistory]);

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
              const drawableLinePixels = filterDrawablePixels(
                linePixels,
                rows,
                cols,
                pixels
              );
              setPreviewLine(drawableLinePixels);
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
        pixels,
        rows,
        cols,
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
            const drawablePixels = filterDrawablePixels(
              previewLine,
              rows,
              cols,
              newPixels
            );
            drawablePixels.forEach((pixel) => {
              applyPixelWithDisabledCheck(
                newPixels,
                pixel.rowIndex,
                pixel.columnIndex,
                pixel.shape,
                rows,
                cols
              );
            });
            return newPixels;
          });
          setPreviewLine([]);
        }

        setTimeout(() => {
          saveDrawingToHistory();
        }, 0);
      }

      setIsDrawing(false);
      setDragStart(null);
      setLineStart(null);
      setLastDrawnPos(null);
    }, [
      isDragging,
      isDrawing,
      brushTool,
      previewLine,
      saveDrawingToHistory,
      rows,
      cols,
    ]);

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

      // 픽셀 그리기
      for (const row of pixels) {
        if (row) {
          for (const pixel of row) {
            if (pixel) {
              if (pixel.disabled) {
                // 비활성화된 셀 표시
                ctx.fillStyle = disabledCellColor;
                ctx.fillRect(
                  pixel.columnIndex * gridSquareLength,
                  pixel.rowIndex * gridSquareLength,
                  gridSquareLength,
                  gridSquareLength
                );

                // X 표시 추가
                ctx.strokeStyle = "#999";
                ctx.lineWidth = 1;
                ctx.beginPath();
                const x = pixel.columnIndex * gridSquareLength;
                const y = pixel.rowIndex * gridSquareLength;
                ctx.moveTo(x + 2, y + 2);
                ctx.lineTo(x + gridSquareLength - 2, y + gridSquareLength - 2);
                ctx.moveTo(x + gridSquareLength - 2, y + 2);
                ctx.lineTo(x + 2, y + gridSquareLength - 2);
                ctx.stroke();
              } else if (pixel.shape) {
                // 일반 도형 그리기
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
      disabledCellColor,
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
