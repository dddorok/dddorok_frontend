import { describe, it, expect } from "vitest";

import {
  createTestPixels,
  createTestSelectedArea,
  TEST_CONSTANTS,
} from "./test-helpers";
import { flipPixelsHorizontal, flipPixelsVertical } from "../utils/pixelFlip";

describe("flipPixelsHorizontal", () => {
  it("선택 영역을 기준으로 픽셀을 좌우 반전한다", () => {
    const pixels = createTestPixels(2, 2, "filled");
    const area = createTestSelectedArea(0, 0, 1, 1);

    const flipped = flipPixelsHorizontal(pixels, area);

    // 좌우 반전 확인
    expect(flipped[0]?.[0]?.columnIndex).toBe(1);
    expect(flipped[0]?.[1]?.columnIndex).toBe(0);
    expect(flipped[1]?.[0]?.columnIndex).toBe(1);
    expect(flipped[1]?.[1]?.columnIndex).toBe(0);
  });

  it("비활성화 셀과 대칭 위치 null 처리를 올바르게 수행한다", () => {
    const pixels = createTestPixels(2, 2, "disabled");
    const area = createTestSelectedArea(0, 0, 1, 1);

    const flipped = flipPixelsHorizontal(pixels, area);

    // (0,1)은 disabled이므로 그대로, (0,0)은 (0,1)이 disabled이므로 null
    expect(flipped[0]?.[0]).toBeNull();
    expect(flipped[0]?.[1]?.disabled).toBe(true);

    // (1,0) <-> (1,1)은 정상 반전
    expect(flipped[1]?.[0]?.columnIndex).toBe(1);
    expect(flipped[1]?.[1]?.columnIndex).toBe(0);
  });

  it("부분 선택 영역에서 올바르게 동작한다", () => {
    const pixels = createTestPixels(3, 3, "filled");
    const area = createTestSelectedArea(1, 1, 2, 2); // 중앙 2x2 영역만 선택

    const flipped = flipPixelsHorizontal(pixels, area);

    // 선택되지 않은 영역은 그대로
    expect(flipped[0]?.[0]?.columnIndex).toBe(0);
    expect(flipped[0]?.[1]?.columnIndex).toBe(1);
    expect(flipped[0]?.[2]?.columnIndex).toBe(2);

    // 선택된 영역만 반전
    expect(flipped[1]?.[1]?.columnIndex).toBe(2);
    expect(flipped[1]?.[2]?.columnIndex).toBe(1);
    expect(flipped[2]?.[1]?.columnIndex).toBe(2);
    expect(flipped[2]?.[2]?.columnIndex).toBe(1);
  });
});

describe("flipPixelsVertical", () => {
  it("선택 영역을 기준으로 픽셀을 상하 반전한다", () => {
    const pixels = createTestPixels(2, 2, "filled");
    const area = createTestSelectedArea(0, 0, 1, 1);

    const flipped = flipPixelsVertical(pixels, area);

    // 상하 반전 확인
    expect(flipped[0]?.[0]?.rowIndex).toBe(1);
    expect(flipped[0]?.[1]?.rowIndex).toBe(1);
    expect(flipped[1]?.[0]?.rowIndex).toBe(0);
    expect(flipped[1]?.[1]?.rowIndex).toBe(0);
  });

  it("비활성화 셀과 대칭 위치 null 처리를 올바르게 수행한다", () => {
    const pixels = createTestPixels(2, 2, "disabled");
    const area = createTestSelectedArea(0, 0, 1, 1);

    const flipped = flipPixelsVertical(pixels, area);

    // (0,1)은 disabled이므로 그대로, (1,1)은 (0,1)이 disabled이므로 null
    expect(flipped[0]?.[1]?.disabled).toBe(true);
    expect(flipped[1]?.[1]).toBeNull();

    // (0,0) <-> (1,0)은 정상 반전
    expect(flipped[0]?.[0]?.rowIndex).toBe(1);
    expect(flipped[1]?.[0]?.rowIndex).toBe(0);
  });

  it("부분 선택 영역에서 올바르게 동작한다", () => {
    const pixels = createTestPixels(3, 3, "filled");
    const area = createTestSelectedArea(1, 1, 2, 2); // 중앙 2x2 영역만 선택

    const flipped = flipPixelsVertical(pixels, area);

    // 선택되지 않은 영역은 그대로
    expect(flipped[0]?.[0]?.rowIndex).toBe(0);
    expect(flipped[0]?.[1]?.rowIndex).toBe(0);
    expect(flipped[0]?.[2]?.rowIndex).toBe(0);

    // 선택된 영역만 반전
    expect(flipped[1]?.[1]?.rowIndex).toBe(2);
    expect(flipped[1]?.[2]?.rowIndex).toBe(2);
    expect(flipped[2]?.[1]?.rowIndex).toBe(1);
    expect(flipped[2]?.[2]?.rowIndex).toBe(1);
  });
});
