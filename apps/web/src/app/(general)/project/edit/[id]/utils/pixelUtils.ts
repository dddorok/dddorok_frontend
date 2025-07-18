import { Shape } from "../Shape.constants";

// 픽셀 관련 타입 - null을 허용하지 않도록 수정
export interface Pixel {
  rowIndex: number;
  columnIndex: number;
  shape: Shape | null;
  disabled: boolean; // optional에서 required로 변경
}

// 빈 픽셀을 나타내는 상수
export const EMPTY_PIXEL: Pixel = {
  rowIndex: 0,
  columnIndex: 0,
  shape: null,
  disabled: false,
};

export interface InitialCellData {
  row: number;
  col: number;
  shape?: Shape | null;
  disabled?: boolean;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface GridPosition {
  row: number;
  col: number;
}

export interface PanOffset {
  x: number;
  y: number;
}

export interface SelectedArea {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface CopiedArea {
  pixels: Pixel[][]; // null을 허용하지 않도록 변경
  width: number;
  height: number;
  startRow: number;
  startCol: number;
}

// createPixel - 항상 유효한 Pixel 객체를 반환
export const createPixel = (
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

// 빈 픽셀 생성 (shape가 null이고 disabled가 false)
export const createEmptyPixel = (
  rowIndex: number,
  columnIndex: number
): Pixel => ({
  rowIndex,
  columnIndex,
  shape: null,
  disabled: false,
});

// 비활성화된 빈 픽셀 생성
export const createDisabledPixel = (
  rowIndex: number,
  columnIndex: number
): Pixel => ({
  rowIndex,
  columnIndex,
  shape: null,
  disabled: true,
});

// interpolatePixels
export const interpolatePixels = (
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

// drawLine
export const drawLine = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  shape: Shape | null,
  disabled: boolean = false
): Pixel[] => {
  return interpolatePixels(startRow, startCol, endRow, endCol, shape, disabled);
};

// isValidPosition
export const isValidPosition = (
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean => {
  return row >= 0 && row < rows && col >= 0 && col < cols;
};

// isCellDisabled - Pixel[][] 타입으로 변경
export const isCellDisabled = (
  row: number,
  col: number,
  pixels: Pixel[][]
): boolean => {
  const existingPixel = pixels[row]?.[col];
  return existingPixel?.disabled || false;
};

// canDrawOnCell - Pixel[][] 타입으로 변경
export const canDrawOnCell = (
  row: number,
  col: number,
  rows: number,
  cols: number,
  pixels: Pixel[][]
): boolean => {
  const isValid = isValidPosition(row, col, rows, cols);
  const isDisabled = isCellDisabled(row, col, pixels);
  return isValid && !isDisabled;
};

// filterDrawablePixels - Pixel[][] 타입으로 변경
export const filterDrawablePixels = (
  pixelsToFilter: Pixel[],
  rows: number,
  cols: number,
  currentPixels: Pixel[][]
): Pixel[] => {
  return pixelsToFilter.filter((pixel) =>
    canDrawOnCell(pixel.rowIndex, pixel.columnIndex, rows, cols, currentPixels)
  );
};

// applyPixelWithDisabledCheck - Pixel[][] 타입으로 변경
export const applyPixelWithDisabledCheck = (
  newPixels: Pixel[][],
  row: number,
  col: number,
  shape: Shape | null,
  rows: number,
  cols: number
): void => {
  if (!canDrawOnCell(row, col, rows, cols, newPixels)) {
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
    targetRow[col] = newPixel;
  }
};

// createInitialPixels - Pixel[][] 타입으로 변경
export const createInitialPixels = (
  rows: number,
  cols: number,
  initialCells: InitialCellData[],
  disabledCells: { row: number; col: number }[]
): Pixel[][] => {
  const pixels: Pixel[][] = [];

  // 모든 셀을 빈 픽셀로 초기화
  for (let row = 0; row < rows; row++) {
    pixels[row] = [];
    for (let col = 0; col < cols; col++) {
      pixels[row]![col] = createEmptyPixel(row, col);
    }
  }

  // 비활성화 셀 설정
  disabledCells.forEach(({ row, col }) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      pixels[row]![col] = createDisabledPixel(row, col);
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
