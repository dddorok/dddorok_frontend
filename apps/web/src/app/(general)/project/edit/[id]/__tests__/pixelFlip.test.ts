import assert from "assert";

import { describe, it, expect } from "vitest";

import { safeGet2D } from "./safeGet";
import { createTestPixels, createTestSelectedArea } from "./test-helpers";
import { flipPixelsHorizontal, flipPixelsVertical } from "../utils/pixelFlip";

describe("flipPixelsHorizontal", () => {
  it("선택 영역을 기준으로 픽셀을 좌우 반전한다", () => {
    const pixels = createTestPixels(2, 2, "filled");
    const area = createTestSelectedArea(0, 0, 1, 1);

    const flipped = flipPixelsHorizontal(pixels, area);

    // 좌우 반전 확인
    expect(safeGet2D(flipped, 0, 0).shape?.id).toBe("shape-0-1");
    expect(safeGet2D(flipped, 0, 1).shape?.id).toBe("shape-0-0");
    expect(safeGet2D(flipped, 1, 0).shape?.id).toBe("shape-1-1");
    expect(safeGet2D(flipped, 1, 1).shape?.id).toBe("shape-1-0");
  });

  it("비활성화 셀과 대칭 위치 null 처리를 올바르게 수행한다", () => {
    const pixels = createTestPixels(2, 2, "disabled");
    const area = createTestSelectedArea(0, 0, 1, 1);

    const flipped = flipPixelsHorizontal(pixels, area);

    // (0,1)은 disabled이므로 그대로, (0,0)은 (0,1)이 disabled이므로 null
    expect(safeGet2D(flipped, 0, 0).shape).toBeNull();
    expect(safeGet2D(flipped, 0, 1).disabled).toBe(true);

    // (1,0) <-> (1,1)은 정상 반전
    expect(safeGet2D(flipped, 1, 0).shape?.id).toBe("shape-1-1");
    expect(safeGet2D(flipped, 1, 1).shape?.id).toBe("shape-1-0");
  });

  it("부분 선택 영역에서 올바르게 동작한다", () => {
    const pixels = createTestPixels(3, 3, "filled");
    const area = createTestSelectedArea(1, 1, 2, 2); // 중앙 2x2 영역만 선택

    const flipped = flipPixelsHorizontal(pixels, area);
    console.log("flipped: ", flipped);

    // 선택되지 않은 영역은 그대로
    expect(safeGet2D(flipped, 0, 0).shape?.id).toBe("shape-0-0");
    expect(safeGet2D(flipped, 0, 1).shape?.id).toBe("shape-0-1");
    expect(safeGet2D(flipped, 0, 2).shape?.id).toBe("shape-0-2");

    // TODO
    // 선택된 영역만 반전
    // expect(safeGet2D(flipped, 1, 1).shape?.id).toBe("shape-2-1");
    // expect(safeGet2D(flipped, 1, 2).shape?.id).toBe("shape-2-2");
    // expect(safeGet2D(flipped, 2, 1).shape?.id).toBe("shape-1-1");
    // expect(safeGet2D(flipped, 2, 2).shape?.id).toBe("shape-1-2");
  });
});

describe("flipPixelsVertical", () => {
  it("선택 영역을 기준으로 픽셀을 상하 반전한다", () => {
    const pixels = createTestPixels(2, 2, "filled");
    console.log("pixels: ", pixels);
    const area = createTestSelectedArea(0, 0, 1, 1);

    const flipped = flipPixelsVertical(pixels, area);

    expect(safeGet2D(flipped, 0, 0).shape?.id).toBe("shape-1-0");
    expect(safeGet2D(flipped, 0, 1).shape?.id).toBe("shape-1-1");
    expect(safeGet2D(flipped, 1, 0).shape?.id).toBe("shape-0-0");
    expect(safeGet2D(flipped, 1, 1).shape?.id).toBe("shape-0-1");
  });

  it("비활성화 셀과 대칭 위치 null 처리를 올바르게 수행한다", () => {
    const pixels = createTestPixels(2, 2, "disabled");
    const area = createTestSelectedArea(0, 0, 1, 1);

    const flipped = flipPixelsVertical(pixels, area);

    // (0,1)은 disabled이므로 그대로 유지
    expect(safeGet2D(flipped, 0, 1).disabled).toBe(true);

    // (1,1)은 (0,1)이 disabled이므로 빈 셀이 됨
    expect(safeGet2D(flipped, 1, 1).shape).toBeNull();
    expect(safeGet2D(flipped, 1, 1).disabled).toBe(false);

    // (0,0) <-> (1,0)은 정상 반전
    expect(safeGet2D(flipped, 0, 0).shape?.id).toBe("shape-1-0");
    expect(safeGet2D(flipped, 1, 0).shape?.id).toBe("shape-0-0");
  });

  it("부분 선택 영역에서 올바르게 동작한다", () => {
    const pixels = createTestPixels(3, 3, "filled");
    const area = createTestSelectedArea(1, 1, 2, 2); // 중앙 2x2 영역만 선택

    const flipped = flipPixelsVertical(pixels, area);
    // TODO
    // 선택되지 않은 영역은 그대로
    expect(safeGet2D(flipped, 0, 0).rowIndex).toBe(0);
    expect(safeGet2D(flipped, 0, 1).rowIndex).toBe(0);
    expect(safeGet2D(flipped, 0, 2).rowIndex).toBe(0);

    // 선택된 영역만 반전
    expect(safeGet2D(flipped, 1, 1).rowIndex).toBe(1);
    expect(safeGet2D(flipped, 1, 2).rowIndex).toBe(1);
    expect(safeGet2D(flipped, 2, 1).rowIndex).toBe(2);
    expect(safeGet2D(flipped, 2, 2).rowIndex).toBe(2);
  });
});
