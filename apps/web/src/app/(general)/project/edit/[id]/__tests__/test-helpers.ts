import {
  createPixel,
  createEmptyPixel,
  createDisabledPixel,
} from "../utils/pixelUtils";

import type { Shape } from "../Shape.constants";
import type { HistoryPixel } from "../utils/historyUtils";
import type { Pixel, SelectedArea, CopiedArea } from "../utils/pixelUtils";

// 기본 Shape 객체 생성
export function createTestShape(
  id = "test-shape",
  name = "Test Shape",
  color = "#000000",
  bgColor = "#ffffff"
): Shape {
  return {
    id,
    name,
    color,
    bgColor,
    render: () => {}, // 테스트용 빈 함수
  };
}

// 기본 Pixel 객체 생성
export function createTestPixel(
  rowIndex = 0,
  columnIndex = 0,
  shape: Shape | null = null,
  disabled = false
): Pixel {
  if (disabled) {
    return createDisabledPixel(rowIndex, columnIndex);
  }
  if (!shape) {
    return createEmptyPixel(rowIndex, columnIndex);
  }
  return createPixel(rowIndex, columnIndex, shape, disabled);
}

// 기본 Pixel 배열 생성
export function createTestPixels(
  rows = 2,
  cols = 2,
  pattern: "empty" | "filled" | "mixed" | "disabled" = "empty"
): Pixel[][] {
  const pixels: Pixel[][] = [];

  for (let row = 0; row < rows; row++) {
    pixels[row] = [];
    for (let col = 0; col < cols; col++) {
      const rowArray = pixels[row];
      if (!rowArray) continue;

      switch (pattern) {
        case "empty":
          rowArray[col] = createEmptyPixel(row, col);
          break;
        case "filled":
          rowArray[col] = createTestPixel(
            row,
            col,
            createTestShape(`shape-${row}-${col}`)
          );
          break;
        case "mixed":
          if ((row + col) % 2 === 0) {
            rowArray[col] = createTestPixel(
              row,
              col,
              createTestShape(`shape-${row}-${col}`)
            );
          } else {
            rowArray[col] = createEmptyPixel(row, col);
          }
          break;
        case "disabled":
          if (row === 0 && col === 1) {
            rowArray[col] = createDisabledPixel(row, col);
          } else {
            rowArray[col] = createTestPixel(
              row,
              col,
              createTestShape(`shape-${row}-${col}`)
            );
          }
          break;
      }
    }
  }

  return pixels;
}

// 기본 SelectedArea 생성
export function createTestSelectedArea(
  startRow = 0,
  startCol = 0,
  endRow = 1,
  endCol = 1
): SelectedArea {
  return {
    startRow,
    startCol,
    endRow,
    endCol,
  };
}

// 기본 CopiedArea 생성
export function createTestCopiedArea(
  width = 2,
  height = 2,
  startRow = 0,
  startCol = 0,
  pattern: "empty" | "filled" | "mixed" = "empty"
): CopiedArea {
  const pixels = createTestPixels(height, width, pattern);

  return {
    pixels,
    width,
    height,
    startRow,
    startCol,
  };
}

// 기본 HistoryPixel 생성
export function createTestHistoryPixel(
  rowIndex = 0,
  columnIndex = 0,
  shapeId: string | null = null,
  disabled = false
): HistoryPixel {
  return {
    rowIndex,
    columnIndex,
    shapeId,
    disabled,
  };
}

// 기본 HistoryPixel 배열 생성
export function createTestHistoryPixels(
  rows = 2,
  cols = 2,
  pattern: "empty" | "filled" | "mixed" = "empty"
): (HistoryPixel | null)[][] {
  const historyPixels: (HistoryPixel | null)[][] = [];

  for (let row = 0; row < rows; row++) {
    historyPixels[row] = [];
    for (let col = 0; col < cols; col++) {
      const rowArray = historyPixels[row];
      if (!rowArray) continue;

      switch (pattern) {
        case "empty":
          rowArray[col] = null;
          break;
        case "filled":
          rowArray[col] = createTestHistoryPixel(
            row,
            col,
            `shape-${row}-${col}`
          );
          break;
        case "mixed":
          if ((row + col) % 2 === 0) {
            rowArray[col] = createTestHistoryPixel(
              row,
              col,
              `shape-${row}-${col}`
            );
          } else {
            rowArray[col] = null;
          }
          break;
      }
    }
  }

  return historyPixels;
}

// Mock Shape 객체들
export const mockShapes = {
  circle: createTestShape("circle", "#ff0000", "#ffffff"),
  square: createTestShape("square", "#00ff00", "#ffffff"),
  triangle: createTestShape("triangle", "#0000ff", "#ffffff"),
  star: createTestShape("star", "#ffff00", "#ffffff"),
};

// Mock 함수들
export const mockGetShapeById = (id: string | null): Shape | null => {
  if (!id) return null;
  return mockShapes[id as keyof typeof mockShapes] || null;
};

// 테스트용 상수들
export const TEST_CONSTANTS = {
  GRID_SIZE: { rows: 5, cols: 5 },
  SMALL_GRID: { rows: 2, cols: 2 },
  LARGE_GRID: { rows: 10, cols: 10 },
  COLORS: {
    PRIMARY: "#1DD9E7",
    SECONDARY: "#9EA5BD",
    DISABLED: "#C8CDD9",
    BACKGROUND: "#ffffff",
  },
} as const;
