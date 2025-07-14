import { describe, it, expect } from "vitest";

import {
  convertPixelToHistory,
  convertHistoryToPixel,
  addToHistory,
  canUndoHistory,
  canRedoHistory,
  executeUndo,
  executeRedo,
  initializeHistory,
  HistoryPixel,
} from "./historyUtils";
import { createPixel } from "./pixelUtils";

describe("historyUtils", () => {
  it("convertPixelToHistory와 convertHistoryToPixel이 상호 변환된다", () => {
    const shape = { id: "shape1" };
    const pixel = createPixel(0, 1, shape, false);
    const history = convertPixelToHistory(pixel);
    expect(history).toMatchObject({
      rowIndex: 0,
      columnIndex: 1,
      shapeId: "shape1",
      disabled: false,
    });
    const pixel2 = convertHistoryToPixel(history, (id) => (id ? shape : null));
    expect(pixel2).toMatchObject({
      rowIndex: 0,
      columnIndex: 1,
      shape,
      disabled: false,
    });
  });

  it("addToHistory로 히스토리 추가 및 trim이 정상 동작한다", () => {
    const entry1 = [
      [{ rowIndex: 0, columnIndex: 0, shapeId: "a" } as HistoryPixel],
    ];
    const entry2 = [
      [{ rowIndex: 0, columnIndex: 0, shapeId: "b" } as HistoryPixel],
    ];
    const { newHistory, newIndex } = addToHistory([entry1], 0, entry2);
    expect(newHistory.length).toBe(2);
    expect(newIndex).toBe(1);
    expect(newHistory[1]?.[0]?.[0]?.shapeId).toBe("b");
  });

  it("canUndoHistory, canRedoHistory가 올바르게 동작한다", () => {
    expect(canUndoHistory(0)).toBe(false);
    expect(canUndoHistory(1)).toBe(true);
    expect(canRedoHistory(0, 2)).toBe(true);
    expect(canRedoHistory(1, 2)).toBe(false);
  });

  it("executeUndo/executeRedo가 올바르게 동작한다", () => {
    const shape = { id: "shape1" };
    const getShapeById = (id: string | null) => (id ? shape : null);
    const pixels1 = [[createPixel(0, 0, shape)]];
    const pixels2 = [[createPixel(0, 0, null)]];
    const historyArr = initializeHistory(pixels1);
    const { newHistory } = addToHistory(historyArr, 0, [
      [{ rowIndex: 0, columnIndex: 0, shapeId: null }],
    ]);
    // Undo
    const undoResult = executeUndo(newHistory, 1, getShapeById);
    expect(undoResult?.pixels?.[0]?.[0]?.shape).toEqual(shape);
    // Redo
    const redoResult = executeRedo(newHistory, 0, getShapeById);
    expect(redoResult?.pixels?.[0]?.[0]?.shape).toBe(null);
  });
});
