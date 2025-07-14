import { describe, it, expect } from "vitest";

import {
  createPixel,
  interpolatePixels,
  canDrawOnCell,
  createInitialPixels,
  Pixel,
  InitialCellData,
} from "./pixelUtils";

describe("interpolatePixels", () => {
  it("대각선 픽셀 배열을 올바르게 반환한다", () => {
    const result = interpolatePixels(0, 0, 2, 2, null);
    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({ rowIndex: 0, columnIndex: 0 });
    expect(result[1]).toMatchObject({ rowIndex: 1, columnIndex: 1 });
    expect(result[2]).toMatchObject({ rowIndex: 2, columnIndex: 2 });
  });

  it("수평선 픽셀 배열을 올바르게 반환한다", () => {
    const result = interpolatePixels(1, 0, 1, 3, null);
    expect(result).toHaveLength(4);
    expect(result[0]).toMatchObject({ rowIndex: 1, columnIndex: 0 });
    expect(result[3]).toMatchObject({ rowIndex: 1, columnIndex: 3 });
  });
});

describe("canDrawOnCell", () => {
  it("비활성화 셀에는 그릴 수 없다", () => {
    const pixels: (Pixel | null)[][] = [
      [createPixel(0, 0, null, true), createPixel(0, 1, null, false)],
      [createPixel(1, 0, null, false), createPixel(1, 1, null, false)],
    ];
    expect(canDrawOnCell(0, 0, 2, 2, pixels)).toBe(false);
    expect(canDrawOnCell(0, 1, 2, 2, pixels)).toBe(true);
  });
});

describe("createInitialPixels", () => {
  it("초기 셀과 비활성화 셀을 올바르게 생성한다", () => {
    const initialCells: InitialCellData[] = [
      { row: 0, col: 0, shape: "A" },
      { row: 1, col: 1, shape: "B" },
    ];
    const disabledCells = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    const pixels = createInitialPixels(2, 2, initialCells, disabledCells);
    expect(pixels[0]?.[0]?.shape).toBe("A");
    expect(pixels[0]?.[1]?.disabled).toBe(true);
    expect(pixels[1]?.[0]?.disabled).toBe(true);
    expect(pixels[1]?.[1]?.shape).toBe("B");
  });
});
