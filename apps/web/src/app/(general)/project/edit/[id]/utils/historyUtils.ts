import type { Pixel } from "./pixelUtils";

export interface HistoryPixel {
  rowIndex: number;
  columnIndex: number;
  shapeId: string | null;
  disabled: boolean; // optional에서 required로 변경
}

export const convertPixelToHistory = (pixel: Pixel): HistoryPixel => ({
  rowIndex: pixel.rowIndex,
  columnIndex: pixel.columnIndex,
  shapeId: pixel.shape?.id || null,
  disabled: pixel.disabled,
});

export const convertHistoryToPixel = (
  historyPixel: HistoryPixel,
  getShapeById: (id: string | null) => any | null
): Pixel => ({
  rowIndex: historyPixel.rowIndex,
  columnIndex: historyPixel.columnIndex,
  shape: getShapeById(historyPixel.shapeId),
  disabled: historyPixel.disabled,
});

export const convertPixelsToHistory = (
  pixels: Pixel[][]
): (HistoryPixel | null)[][] => {
  return pixels.map((row) =>
    row ? row.map((pixel) => convertPixelToHistory(pixel)) : []
  );
};

export const convertHistoryToPixels = (
  historyPixels: (HistoryPixel | null)[][],
  getShapeById: (id: string | null) => any | null
): Pixel[][] => {
  return historyPixels.map((row) =>
    row
      ? row.map(
          (historyPixel) =>
            historyPixel
              ? convertHistoryToPixel(historyPixel, getShapeById)
              : { rowIndex: 0, columnIndex: 0, shape: null, disabled: false } // 기본 픽셀
        )
      : []
  );
};

export const createHistoryEntry = (
  pixels: Pixel[][]
): (HistoryPixel | null)[][] => {
  return convertPixelsToHistory(pixels);
};

export const trimHistoryIfNeeded = (
  history: (HistoryPixel | null)[][][],
  maxSize: number = 50
): { trimmedHistory: (HistoryPixel | null)[][][]; newIndex: number } => {
  if (history.length <= maxSize) {
    return { trimmedHistory: history, newIndex: history.length - 1 };
  }
  const trimmedHistory = history.slice(-maxSize);
  return { trimmedHistory, newIndex: trimmedHistory.length - 1 };
};

export const addToHistory = (
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

export const initializeHistory = (
  initialPixels: Pixel[][]
): (HistoryPixel | null)[][][] => {
  const initialHistoryData = createHistoryEntry(initialPixels);
  return [initialHistoryData];
};

export const canUndoHistory = (historyIndex: number): boolean =>
  historyIndex > 0;

export const canRedoHistory = (
  historyIndex: number,
  historyLength: number
): boolean => historyIndex < historyLength - 1;

export const executeUndo = (
  history: (HistoryPixel | null)[][][],
  historyIndex: number,
  getShapeById: (id: string | null) => any | null
): { pixels: Pixel[][]; newIndex: number } | null => {
  if (!canUndoHistory(historyIndex)) return null;
  const prevHistoryPixels = history[historyIndex - 1];
  if (!prevHistoryPixels) return null;
  const pixels = convertHistoryToPixels(prevHistoryPixels, getShapeById);
  return { pixels, newIndex: historyIndex - 1 };
};

export const executeRedo = (
  history: (HistoryPixel | null)[][][],
  historyIndex: number,
  getShapeById: (id: string | null) => any | null
): { pixels: Pixel[][]; newIndex: number } | null => {
  if (!canRedoHistory(historyIndex, history.length)) return null;
  const nextHistoryPixels = history[historyIndex + 1];
  if (!nextHistoryPixels) return null;
  const pixels = convertHistoryToPixels(nextHistoryPixels, getShapeById);
  return { pixels, newIndex: historyIndex + 1 };
};
