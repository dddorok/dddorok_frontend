import { describe, it, expect } from "vitest";

import {
  createTestShape,
  createTestPixel,
  createTestPixels,
  createTestHistoryPixel,
  createTestHistoryPixels,
  mockGetShapeById,
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
    const shape = createTestShape("shape1");
    const pixel = createTestPixel(0, 1, shape, false);
    const history = convertPixelToHistory(pixel);

    expect(history).toMatchObject({
      rowIndex: 0,
      columnIndex: 1,
      shapeId: "shape1",
      disabled: false,
    });

    const pixel2 = convertHistoryToPixel(history, mockGetShapeById);
    expect(pixel2).toMatchObject({
      rowIndex: 0,
      columnIndex: 1,
      shape,
      disabled: false,
    });
  });

  it("addToHistory로 히스토리 추가 및 trim이 정상 동작한다", () => {
    const entry1 = createTestHistoryPixels(1, 1, "filled");
    const entry2 = createTestHistoryPixels(1, 1, "empty");

    const { newHistory, newIndex } = addToHistory([entry1], 0, entry2);
    expect(newHistory.length).toBe(2);
    expect(newIndex).toBe(1);
    expect(newHistory[1]?.[0]?.[0]?.shapeId).toBeNull();
  });

  it("canUndoHistory, canRedoHistory가 올바르게 동작한다", () => {
    expect(canUndoHistory(0)).toBe(false);
    expect(canUndoHistory(1)).toBe(true);
    expect(canRedoHistory(0, 2)).toBe(true);
    expect(canRedoHistory(1, 2)).toBe(false);
  });

  it("executeUndo/executeRedo가 올바르게 동작한다", () => {
    const shape = createTestShape("shape1");
    const pixels1 = [[createTestPixel(0, 0, shape)]];
    const pixels2 = [[createTestPixel(0, 0, null)]];

    const historyArr = initializeHistory(pixels1);
    const { newHistory } = addToHistory(historyArr, 0, [
      [{ rowIndex: 0, columnIndex: 0, shapeId: null, disabled: false }],
    ]);

    // Undo
    const undoResult = executeUndo(newHistory, 1, mockGetShapeById);
    expect(undoResult?.pixels?.[0]?.[0]?.shape).toEqual(shape);

    // Redo
    const redoResult = executeRedo(newHistory, 0, mockGetShapeById);
    expect(redoResult?.pixels?.[0]?.[0]?.shape).toBeNull();
  });

  it("initializeHistory가 올바르게 동작한다", () => {
    const pixels = createTestPixels(2, 2, "mixed");
    const history = initializeHistory(pixels);

    expect(history).toHaveLength(1);
    expect(history[0]).toHaveLength(2);
    expect(history[0]?.[0]).toHaveLength(2);

    // mixed 패턴 확인: (0,0)과 (1,1)에만 shape가 있음
    expect(history[0]?.[0]?.[0]?.shapeId).toBe("shape-0-0");
    expect(history[0]?.[0]?.[1]).toBeNull();
    expect(history[0]?.[1]?.[0]).toBeNull();
    expect(history[0]?.[1]?.[1]?.shapeId).toBe("shape-1-1");
  });
});
