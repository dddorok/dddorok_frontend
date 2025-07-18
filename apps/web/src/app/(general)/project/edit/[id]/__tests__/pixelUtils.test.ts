import { describe, it, expect } from "vitest";

import {
  createTestPixels,
  createTestShape,
  TEST_CONSTANTS,
} from "./test-helpers";
import {
  interpolatePixels,
  canDrawOnCell,
  createInitialPixels,
} from "../utils/pixelUtils";

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
    const pixels = createTestPixels(2, 2, "disabled");
    expect(canDrawOnCell(0, 0, 2, 2, pixels)).toBe(true);
    expect(canDrawOnCell(0, 1, 2, 2, pixels)).toBe(false); // disabled 셀
    expect(canDrawOnCell(1, 0, 2, 2, pixels)).toBe(true);
    expect(canDrawOnCell(1, 1, 2, 2, pixels)).toBe(true);
  });

  it("격자 범위를 벗어난 셀에는 그릴 수 없다", () => {
    const pixels = createTestPixels(2, 2, "empty");
    expect(canDrawOnCell(-1, 0, 2, 2, pixels)).toBe(false);
    expect(canDrawOnCell(0, -1, 2, 2, pixels)).toBe(false);
    expect(canDrawOnCell(2, 0, 2, 2, pixels)).toBe(false);
    expect(canDrawOnCell(0, 2, 2, 2, pixels)).toBe(false);
  });
});

describe("createInitialPixels", () => {
  it("초기 셀과 비활성화 셀을 올바르게 생성한다", () => {
    const initialCells = [
      { row: 0, col: 0, shape: createTestShape("A") },
      { row: 1, col: 1, shape: createTestShape("B") },
    ];
    const disabledCells = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    const pixels = createInitialPixels(2, 2, initialCells, disabledCells);

    expect(pixels[0]?.[0]?.shape?.id).toBe("A");
    expect(pixels[0]?.[1]?.disabled).toBe(true);
    expect(pixels[1]?.[0]?.disabled).toBe(true);
    expect(pixels[1]?.[1]?.shape?.id).toBe("B");
  });

  it("빈 격자를 올바르게 생성한다", () => {
    const pixels = createInitialPixels(3, 3, [], []);
    expect(pixels).toHaveLength(3);
    expect(pixels[0]).toHaveLength(3);
    expect(pixels[0]?.[0]?.disabled).toBe(false);
    expect(pixels[0]?.[0]?.shape).toBeNull();
  });
});
