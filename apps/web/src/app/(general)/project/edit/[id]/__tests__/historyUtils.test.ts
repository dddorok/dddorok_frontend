import { describe, it, expect } from "vitest";

import { safeGet3D } from "./safeGet";
import {
  createTestShape,
  createTestPixel,
  createTestPixels,
  createTestHistoryPixel,
  createTestHistoryPixels,
  mockGetShapeById,
  mockShapes,
} from "./test-helpers";
import {
  convertPixelToHistory,
  convertHistoryToPixel,
  addToHistory,
  canUndoHistory,
  canRedoHistory,
  executeUndo,
  executeRedo,
  initializeHistory,
} from "../utils/historyUtils";

describe("historyUtils", () => {
  it("convertPixelToHistory와 convertHistoryToPixel이 상호 변환된다", () => {
    const shape = mockShapes.square;
    const pixel = createTestPixel(0, 1, shape, false);

    // Pixel → HistoryPixel
    const history = convertPixelToHistory(pixel);
    expect(history).toMatchObject({
      rowIndex: 0,
      columnIndex: 1,
      shapeId: "square",
      bgColor: "#ffffff",
      disabled: false,
    });

    // HistoryPixel → Pixel
    const pixel2 = convertHistoryToPixel(history, mockGetShapeById);
    expect(pixel2).toMatchObject({
      rowIndex: 0,
      columnIndex: 1,
      shape: shape,
      disabled: false,
    });
  });

  it("addToHistory로 히스토리 추가 및 trim이 정상 동작한다", () => {
    // 1. 첫 번째 entry: shape이 있는 상태
    const entry1 = createTestHistoryPixels(1, 1, "filled");
    // 2. 두 번째 entry: shape이 없는 상태
    const entry2 = createTestHistoryPixels(1, 1, "empty");

    // addToHistory로 두 번째 entry 추가
    const { newHistory, newIndex } = addToHistory([entry1], 0, entry2);

    // 두 개의 히스토리 entry가 쌓였는지 확인
    expect(newHistory.length).toBe(2);
    expect(newIndex).toBe(1);

    // 첫 번째 entry는 shapeId가 있음
    expect(safeGet3D(newHistory, 0, 0, 0)?.shapeId).not.toBeNull();
    // 두 번째 entry는 shapeId가 없음
    expect(safeGet3D(newHistory, 1, 0, 0)).toBeNull();
  });

  it("canUndoHistory, canRedoHistory가 올바르게 동작한다", () => {
    expect(canUndoHistory(0)).toBe(false);
    expect(canUndoHistory(1)).toBe(true);
    expect(canRedoHistory(0, 2)).toBe(true);
    expect(canRedoHistory(1, 2)).toBe(false);
  });

  it("executeUndo/executeRedo가 올바르게 동작한다", () => {
    // 1. 최초 픽셀
    const pixels1 = [[createTestPixel(0, 0, mockShapes.square)]];
    const historyArr = initializeHistory(pixels1);

    // 2. 두 번째 상태(빈 셀)
    const { newHistory } = addToHistory(historyArr, 0, [
      [
        {
          rowIndex: 0,
          columnIndex: 0,
          shapeId: null,
          bgColor: null,
          disabled: false,
        },
      ],
    ]);

    // Undo (두 번째 상태 -> 첫 번째 상태)
    const undoResult = executeUndo(newHistory, 1, mockGetShapeById);
    expect(undoResult).not.toBeNull();
    if (undoResult && undoResult.pixels[0] && undoResult.pixels[0][0]) {
      expect(undoResult.pixels[0][0].shape).toEqual(mockShapes.square);
      expect(undoResult.pixels[0][0].disabled).toBe(false);
    }

    // Redo (첫 번째 상태 -> 두 번째 상태)
    const redoResult = executeRedo(newHistory, 0, mockGetShapeById);
    expect(redoResult).not.toBeNull();
    if (redoResult && redoResult.pixels[0] && redoResult.pixels[0][0]) {
      expect(redoResult.pixels[0][0].shape).toBeNull();
      expect(redoResult.pixels[0][0].disabled).toBe(false);
    }
  });

  it("initializeHistory가 올바르게 동작한다", () => {
    const pixels = createTestPixels(2, 2, "mixed");
    const history = initializeHistory(pixels);

    expect(history).toHaveLength(1);
    expect(history[0]).toHaveLength(2);
    expect(history[0]?.[0]).toHaveLength(2);

    // mixed 패턴 확인: (0,0)과 (1,1)에만 shape가 있음
    expect(safeGet3D(history, 0, 0, 0)?.shapeId).toBe("shape-0-0");
    expect(safeGet3D(history, 0, 0, 1)?.shapeId).toBeNull();
    expect(safeGet3D(history, 0, 1, 0)?.shapeId).toBeNull();
    expect(safeGet3D(history, 0, 1, 1)?.shapeId).toBe("shape-1-1");
  });
});
