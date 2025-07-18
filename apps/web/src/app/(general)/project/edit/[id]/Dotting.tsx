/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  CSSProperties,
} from "react";

import {
  BrushTool,
  BrushToolType,
  SelectionBackgroundColorType,
} from "./constant";
import {
  KNITTING_SYMBOL_FULL_OBJ,
  KNITTING_SYMBOLS,
  Shape,
} from "./Shape.constants";
import {
  initializeHistory,
  createHistoryEntry,
  addToHistory,
  executeUndo,
  executeRedo,
  canUndoHistory,
  canRedoHistory,
} from "./utils/historyUtils";
import { flipPixelsHorizontal, flipPixelsVertical } from "./utils/pixelFlip";
import {
  CopiedArea,
  createInitialPixels,
  createPixel,
  GridPosition,
  InitialCellData,
  interpolatePixels,
  MousePosition,
  PanOffset,
  Pixel,
  SelectedArea,
  createDisabledPixel,
  createEmptyPixel,
} from "./utils/pixelUtils";

// 히스토리용 픽셀 데이터 타입 (shape를 ID로만 저장)
export interface HistoryPixel {
  rowIndex: number;
  columnIndex: number;
  shapeId: string | null;
  bgColor: string | null;
  disabled: boolean;
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
  selectionBackgroundColor?: SelectionBackgroundColorType; // 선택 영역 배경색
  onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void; // 클릭 이벤트 핸들러
  onCopy?: () => void; // 복사 완료 시 호출
  onPaste?: () => void; // 붙여넣기 완료 시 호출
}

interface DottingRef {
  clear: () => void;
  getPixels: () => Pixel[][];
  setPixels: (newPixels: Pixel[][]) => void;
  exportImage: () => string;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  copySelectedArea: (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) => CopiedArea | null;
  pasteArea: (
    targetRow: number,
    targetCol: number,
    copiedArea: CopiedArea
  ) => void;
  getSelectedArea: () => {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } | null;
  getPanZoomInfo: () => { panOffset: PanOffset; scale: number };
  getGridPosition: (
    canvasX: number,
    canvasY: number
  ) => { row: number; col: number };
  getCanvasPosition: () => { x: number; y: number } | null;
  flipHorizontal: () => void;
  flipVertical: () => void;
}

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
  pixels: Pixel[][]
): boolean => {
  const existingPixel = pixels[row]?.[col];
  return existingPixel?.disabled || false;
};

const canDrawOnCell = (
  row: number,
  col: number,
  rows: number,
  cols: number,
  pixels: Pixel[][]
): boolean => {
  const isValid = isValidPosition(row, col, rows, cols);
  const isDisabled = isCellDisabled(row, col, pixels);
  const canDraw = isValid && !isDisabled;

  // console.log(`canDrawOnCell [${row}][${col}]:`, {
  //   isValid,
  //   isDisabled,
  //   canDraw,
  // });

  return canDraw;
};

const filterDrawablePixels = (
  pixelsToFilter: Pixel[],
  rows: number,
  cols: number,
  currentPixels: Pixel[][]
): Pixel[] => {
  return pixelsToFilter.filter((pixel) =>
    canDrawOnCell(pixel.rowIndex, pixel.columnIndex, rows, cols, currentPixels)
  );
};

const applyPixelWithDisabledCheck = (
  newPixels: Pixel[][],
  row: number,
  col: number,
  shape: Shape | null,
  rows: number,
  cols: number
): void => {
  // console.log(`applyPixelWithDisabledCheck 호출: [${row}][${col}]`, {
  //   shape,
  //   rows,
  //   cols,
  // });

  if (!canDrawOnCell(row, col, rows, cols, newPixels)) {
    console.log(`셀 [${row}][${col}]에 그릴 수 없음`);
    return;
  }

  if (!newPixels[row]) newPixels[row] = [];
  const targetRow = newPixels[row];
  if (targetRow) {
    const existingDisabled = targetRow[col]?.disabled || false;
    const newPixel = shape
      ? createPixel(row, col, shape, existingDisabled)
      : existingDisabled
        ? createDisabledPixel(row, col)
        : createEmptyPixel(row, col);

    // console.log(`픽셀 설정: [${row}][${col}]`, newPixel);
    targetRow[col] = newPixel;
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
  const currentShape = KNITTING_SYMBOL_FULL_OBJ[shape.id];
  if (currentShape) {
    currentShape.render(ctx, x, y, size, currentShape.color, shape.bgColor);
  }
};

const LABEL_MARGIN_RATIO = 1.2; // 셀 크기의 1.2배만큼 여백

// ===== 격자(그리드) 색상 상수 =====
const GRID_MINOR_COLOR = "#9EA5BD"; // 1칸마다 연한 선
const GRID_MAJOR_COLOR = "#9EA5BD"; // 5칸마다 진한 선
const GRID_MINOR_WIDTH = 1;
const GRID_MAJOR_WIDTH = 2;

// ===== 선택 영역 색상 상수 =====
const SELECTED_AREA_BG_COLOR = "rgba(28, 31, 37, 0.1)";
const SELECTED_AREA_BORDER_COLOR = "#1DD9E7";
const SELECTED_AREA_BORDER_WIDTH = 0.8;

// ===== 복사 영역 스타일 상수 =====
const COPY_AREA_BORDER_COLOR = "#1DD9E7";
const COPY_AREA_BORDER_WIDTH = 1.5;
const COPY_AREA_DASH_ARRAY = [6, 4];

// ===== 커서 스타일 상수 =====
const CURSOR_DEFAULT = "default"; // 일반 커서
const CURSOR_CROSSHAIR = "crosshair"; // 십자가
const CURSOR_GRAB = "grab";
const CURSOR_GRABBING = "grabbing";

// ===== 행/열 번호 폰트 및 영역 상수 =====
const LABEL_FONT_SIZE = 14; // px
const LABEL_AREA_SIZE = 20; // px (행/열 번호가 차지하는 영역)

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
      disabledCellColor = "#C8CDD9",
      selectionBackgroundColor = "#1DD9E7",
      onClick,
      onCopy,
      onPaste,
    },
    ref
  ) => {
    const LABEL_MARGIN = LABEL_AREA_SIZE; // gridSquareLength * LABEL_MARGIN_RATIO -> LABEL_AREA_SIZE로 변경
    // width, height를 rows, cols, gridSquareLength, LABEL_MARGIN로 계산
    const width = cols * gridSquareLength + LABEL_MARGIN;
    const height = rows * gridSquareLength + LABEL_MARGIN;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pixels, setPixels] = useState<Pixel[][]>(() =>
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
    const [copiedArea, setCopiedArea] = useState<CopiedArea | null>(null);

    // brushTool이 변경될 때 선택 영역 초기화
    useEffect(() => {
      if (brushTool !== BrushTool.SELECT) {
        setSelectedArea(null);
      }
    }, [brushTool]);

    // shape ID로 실제 shape 객체를 찾는 함수
    const getShapeById = useCallback(
      (shapeId: string | null): Shape | null => {
        if (!shapeId) return null;
        return KNITTING_SYMBOL_FULL_OBJ[shapeId] || null;
      },
      [shapes]
    );

    // 픽셀 상태를 히스토리에 저장하는 함수 (개선된 유틸리티 사용)
    const saveToHistory = useCallback(
      (newPixels: Pixel[][]) => {
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

    // 복사 함수
    const copySelectedArea = useCallback(() => {
      if (selectedArea) {
        const copied = copySelectedAreaInternal(
          selectedArea.startRow,
          selectedArea.startCol,
          selectedArea.endRow,
          selectedArea.endCol
        );
        if (copied) {
          setCopiedArea(copied);
          onCopy?.();
          console.log("복사 완료:", copied);
        }
      }
    }, [selectedArea, onCopy]);

    // 붙여넣기 함수
    const pasteAtPosition = useCallback(
      (row: number, col: number) => {
        console.log("copiedArea: ", copiedArea);
        if (copiedArea) {
          pasteAreaInternal(row, col, copiedArea);
          onPaste?.();
          console.log("붙여넣기 완료:", { row, col });
        }
      },
      [copiedArea, onPaste]
    );

    // 내부 복사 함수
    const copySelectedAreaInternal = useCallback(
      (
        startRow: number,
        startCol: number,
        endRow: number,
        endCol: number
      ): CopiedArea | null => {
        if (startRow < 0 || startCol < 0 || endRow >= rows || endCol >= cols)
          return null;

        const copiedPixels = pixels
          .slice(startRow, endRow + 1)
          .map((row) => row.slice(startCol, endCol + 1).map((pixel) => pixel));

        return {
          pixels: copiedPixels,
          width: endCol - startCol + 1,
          height: endRow - startRow + 1,
          startRow,
          startCol,
        };
      },
      [pixels, rows, cols]
    );

    // 내부 붙여넣기 함수
    const pasteAreaInternal = useCallback(
      (targetRow: number, targetCol: number, areaToPaste: CopiedArea) => {
        if (
          targetRow < 0 ||
          targetCol < 0 ||
          targetRow + areaToPaste.height > rows ||
          targetCol + areaToPaste.width > cols
        ) {
          console.log("붙여넣기 범위 초과");
          return;
        }

        setPixels((prev) => {
          const newPixels = [...prev];

          for (let row = 0; row < areaToPaste.height; row++) {
            for (let col = 0; col < areaToPaste.width; col++) {
              const pixel = areaToPaste.pixels[row]?.[col];

              if (pixel) {
                const targetRowIndex = targetRow + row;
                const targetColIndex = targetCol + col;

                applyPixelWithDisabledCheck(
                  newPixels,
                  targetRowIndex,
                  targetColIndex,
                  pixel.shape,
                  rows,
                  cols
                );
              }
            }
          }

          return newPixels;
        });

        // 붙여넣기 완료 후 히스토리 저장
        setTimeout(() => {
          saveToHistory(pixels);
        }, 100);
      },
      [rows, cols, saveToHistory, pixels]
    );

    const handlePaste = useCallback(() => {
      console.log("handlePaste: ");
      if (!selectedArea) return;

      if (copiedArea) {
        pasteAtPosition(selectedArea.startRow, selectedArea.startCol);
      }
    }, [selectedArea, copiedArea, pasteAtPosition]);

    // 선택 영역을 null로 만드는 공통 함수
    const clearSelectedAreaPixels = (
      pixels: Pixel[][],
      area: SelectedArea
    ): Pixel[][] => {
      return pixels.map((row, rowIdx) =>
        row.map((pixel, colIdx) => {
          if (
            rowIdx >= area.startRow &&
            rowIdx <= area.endRow &&
            colIdx >= area.startCol &&
            colIdx <= area.endCol
          ) {
            return pixel?.disabled ? pixel : { ...pixel, shape: null };
          }
          return pixel;
        })
      );
    };

    // ref를 통해 외부에서 사용할 수 있는 메서드들
    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          const newPixels: Pixel[][] = [];
          setPixels(newPixels);
          saveToHistory(newPixels);
        },
        getPixels: () => pixels,
        setPixels: (newPixels: Pixel[][]) => {
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
        copySelectedArea: (
          startRow: number,
          startCol: number,
          endRow: number,
          endCol: number
        ) => {
          if (startRow < 0 || startCol < 0 || endRow >= rows || endCol >= cols)
            return null;
          const selectedArea: SelectedArea = {
            startRow,
            startCol,
            endRow,
            endCol,
          };
          const copiedPixels = pixels
            .slice(startRow, endRow + 1)
            .map((row) => row.slice(startCol, endCol + 1));
          const copiedArea: CopiedArea = {
            pixels: copiedPixels,
            width: endCol - startCol + 1,
            height: endRow - startRow + 1,
            startRow,
            startCol,
          };
          return copiedArea;
        },
        pasteArea: (
          targetRow: number,
          targetCol: number,
          copiedArea: CopiedArea
        ) => {
          console.log("pasteArea 호출됨:", {
            targetRow,
            targetCol,
            copiedArea,
          });

          if (
            targetRow < 0 ||
            targetCol < 0 ||
            targetRow + copiedArea.height > rows ||
            targetCol + copiedArea.width > cols
          ) {
            console.log("붙여넣기 범위 초과");
            return;
          }

          setPixels((prev) => {
            console.log("이전 픽셀 상태:", prev);
            const newPixels = [...prev];

            for (let row = 0; row < copiedArea.height; row++) {
              for (let col = 0; col < copiedArea.width; col++) {
                const pixel = copiedArea.pixels[row]?.[col];
                console.log(`복사된 픽셀 [${row}][${col}]:`, pixel);

                if (pixel) {
                  const targetRowIndex = targetRow + row;
                  const targetColIndex = targetCol + col;
                  console.log(
                    `붙여넣기 위치 [${targetRowIndex}][${targetColIndex}]:`,
                    pixel.shape
                  );

                  applyPixelWithDisabledCheck(
                    newPixels,
                    targetRowIndex,
                    targetColIndex,
                    pixel.shape,
                    rows,
                    cols
                  );
                }
              }
            }

            console.log("새로운 픽셀 상태:", newPixels);
            return newPixels;
          });

          // 붙여넣기 완료 후 히스토리 저장
          setTimeout(() => {
            console.log("히스토리 저장 시도");
            saveToHistory(pixels);
          }, 100);
        },
        getSelectedArea: () => selectedArea || null,
        getPanZoomInfo: () => ({ panOffset, scale }),
        getGridPosition: (canvasX: number, canvasY: number) => {
          // 패닝과 줌을 고려한 그리드 위치 계산
          const adjustedX = (canvasX - panOffset.x) / scale;
          const adjustedY = (canvasY - panOffset.y) / scale;
          const col = Math.floor(adjustedX / gridSquareLength);
          const row = Math.floor(adjustedY / gridSquareLength);
          return { row, col };
        },
        getCanvasPosition: () => {
          // 마우스 이벤트에서 캔버스 위치를 가져오는 방식으로 변경
          // 현재는 null을 반환하고, 실제 사용 시에는 마우스 이벤트에서 위치를 전달받아야 함
          return null;
        },
        copy: copySelectedArea,
        paste: pasteAtPosition,
        handlePaste: handlePaste,
        cut: () => {
          if (!selectedArea) return;
          // 1. 복사
          const copied = copySelectedAreaInternal(
            selectedArea.startRow,
            selectedArea.startCol,
            selectedArea.endRow,
            selectedArea.endCol
          );
          if (copied) {
            setCopiedArea(copied);
            onCopy?.();
          }
          // 2. 선택 영역을 null로 덮어쓰기(지우기)
          setPixels((prev) => clearSelectedAreaPixels(prev, selectedArea));
          // 3. 히스토리 저장
          setTimeout(() => {
            saveToHistory(clearSelectedAreaPixels(pixels, selectedArea));
          }, 0);
        },
        flipHorizontal: () => {
          if (!selectedArea) return;
          setPixels((prev) => {
            const newPixels = flipPixelsHorizontal(prev, selectedArea);
            saveToHistory(newPixels);
            return newPixels;
          });
        },
        flipVertical: () => {
          if (!selectedArea) return;
          setPixels((prev) => {
            const newPixels = flipPixelsVertical(prev, selectedArea);
            saveToHistory(newPixels);
            return newPixels;
          });
        },
      }),
      [
        undo,
        redo,
        canUndo,
        canRedo,
        copySelectedArea,
        pasteAtPosition,
        handlePaste,
        saveToHistory,
        pixels,
        cols,
        gridSquareLength,
        rows,
        backgroundColor,
        selectedArea,
        panOffset,
        scale,
      ]
    );

    const getMousePos = useCallback(
      (e: React.MouseEvent): MousePosition => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        // LABEL_MARGIN 만큼 빼서 실제 그리드 좌표로 변환
        const x = (e.clientX - rect.left - panOffset.x - LABEL_MARGIN) / scale;
        const y = (e.clientY - rect.top - panOffset.y - LABEL_MARGIN) / scale;
        return { x, y };
      },
      [panOffset, scale, LABEL_MARGIN]
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
          case BrushTool.PALETTE:
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
          case BrushTool.PALETTE:
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

    // 선택 영역 그리기 부분 수정
    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();

      // 캔버스 크기 설정
      canvas.width = width;
      canvas.height = height;

      // 배경 그리기
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // 패닝과 줌 적용
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(scale, scale);

      // 비활성화 셀 그리기
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (isCellDisabled(row, col, pixels)) {
            ctx.fillStyle = disabledCellColor;
            ctx.fillRect(
              LABEL_MARGIN + col * gridSquareLength,
              LABEL_MARGIN + row * gridSquareLength,
              gridSquareLength,
              gridSquareLength
            );
          }
        }
      }

      // 픽셀 그리기
      for (const row of pixels) {
        if (row) {
          for (const pixel of row) {
            if (pixel && !pixel.disabled && pixel.shape) {
              drawShape(
                ctx,
                pixel.shape,
                LABEL_MARGIN + pixel.columnIndex * gridSquareLength,
                LABEL_MARGIN + pixel.rowIndex * gridSquareLength,
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
              LABEL_MARGIN + pixel.columnIndex * gridSquareLength,
              LABEL_MARGIN + pixel.rowIndex * gridSquareLength,
              gridSquareLength
            );
          }
        }
      }

      // 선택 영역 그리기
      if (selectedArea) {
        // 배경 채우기 (동적 색상 사용)
        ctx.save();
        ctx.globalAlpha = 0.2; // 투명도 조정
        ctx.fillStyle = selectionBackgroundColor;
        ctx.fillRect(
          LABEL_MARGIN + selectedArea.startCol * gridSquareLength,
          LABEL_MARGIN + selectedArea.startRow * gridSquareLength,
          (selectedArea.endCol - selectedArea.startCol + 1) * gridSquareLength,
          (selectedArea.endRow - selectedArea.startRow + 1) * gridSquareLength
        );
        ctx.restore();

        // 파란색 실선 border
        ctx.save();
        ctx.strokeStyle = SELECTED_AREA_BORDER_COLOR;
        ctx.lineWidth = SELECTED_AREA_BORDER_WIDTH;
        ctx.setLineDash([]); // 실선
        ctx.strokeRect(
          LABEL_MARGIN + selectedArea.startCol * gridSquareLength,
          LABEL_MARGIN + selectedArea.startRow * gridSquareLength,
          (selectedArea.endCol - selectedArea.startCol + 1) * gridSquareLength,
          (selectedArea.endRow - selectedArea.startRow + 1) * gridSquareLength
        );
        ctx.restore();
      }

      // 복사된 영역 점선 border 그리기
      if (copiedArea) {
        ctx.save();
        ctx.strokeStyle = COPY_AREA_BORDER_COLOR;
        ctx.lineWidth = COPY_AREA_BORDER_WIDTH;
        ctx.setLineDash(COPY_AREA_DASH_ARRAY); // 점선
        ctx.strokeRect(
          LABEL_MARGIN + copiedArea.startCol * gridSquareLength,
          LABEL_MARGIN + copiedArea.startRow * gridSquareLength,
          copiedArea.width * gridSquareLength,
          copiedArea.height * gridSquareLength
        );
        ctx.restore();
      }

      // 마지막에 격자 그리기 (5칸마다 진하게, 나머지 연하게)
      if (isGridVisible) {
        // 수직선
        for (let i = 0; i <= cols; i++) {
          ctx.beginPath();
          ctx.strokeStyle = i % 5 === 0 ? GRID_MAJOR_COLOR : GRID_MINOR_COLOR;
          ctx.lineWidth = i % 5 === 0 ? GRID_MAJOR_WIDTH : GRID_MINOR_WIDTH;
          const x = LABEL_MARGIN + i * gridSquareLength;
          ctx.moveTo(x, LABEL_MARGIN);
          ctx.lineTo(x, LABEL_MARGIN + rows * gridSquareLength);
          ctx.stroke();
        }

        // 수평선
        for (let i = 0; i <= rows; i++) {
          ctx.beginPath();
          ctx.strokeStyle = i % 5 === 0 ? GRID_MAJOR_COLOR : GRID_MINOR_COLOR;
          ctx.lineWidth = i % 5 === 0 ? GRID_MAJOR_WIDTH : GRID_MINOR_WIDTH;
          const y = LABEL_MARGIN + i * gridSquareLength;
          ctx.moveTo(LABEL_MARGIN, y);
          ctx.lineTo(LABEL_MARGIN + cols * gridSquareLength, y);
          ctx.stroke();
        }
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
      selectionBackgroundColor, // 의존성 배열에 추가
      LABEL_MARGIN,
      GRID_MINOR_COLOR,
      GRID_MAJOR_COLOR,
      GRID_MINOR_WIDTH,
      GRID_MAJOR_WIDTH,
      copiedArea,
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
          // border: "1px solid #ccc",
          cursor:
            brushTool === BrushTool.SELECT
              ? CURSOR_CROSSHAIR
              : brushTool === BrushTool.NONE
                ? isDragging
                  ? CURSOR_GRABBING
                  : CURSOR_GRAB
                : CURSOR_CROSSHAIR,
          border: "none",
          ...style,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={onClick}
      />
    );
  }
);

Dotting.displayName = "Dotting";
