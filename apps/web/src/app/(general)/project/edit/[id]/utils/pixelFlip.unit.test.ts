import { describe, it, expect } from "vitest";

import { flipPixelsHorizontal } from "./pixelFlip";

import type { SelectedArea, Pixel } from "./pixelUtils";

describe("flipPixelsHorizontal", () => {
  it("선택 영역을 기준으로 픽셀을 좌우 반전한다", () => {
    // 2x2 영역, 0/1/2/3 값
    const pixels: (Pixel | null)[][] = [
      [
        { rowIndex: 0, columnIndex: 0, shape: null },
        { rowIndex: 0, columnIndex: 1, shape: null },
      ],
      [
        { rowIndex: 1, columnIndex: 0, shape: null },
        { rowIndex: 1, columnIndex: 1, shape: null },
      ],
    ];
    const area: SelectedArea = {
      startRow: 0,
      startCol: 0,
      endRow: 1,
      endCol: 1,
    };
    const flipped = flipPixelsHorizontal(pixels, area);
    expect(flipped[0]?.[0]?.columnIndex).toBe(1);
    expect(flipped[0]?.[1]?.columnIndex).toBe(0);
    expect(flipped[1]?.[0]?.columnIndex).toBe(1);
    expect(flipped[1]?.[1]?.columnIndex).toBe(0);
  });

  it("비활성화 셀과 대칭 위치 null 처리를 올바르게 수행한다", () => {
    // 2x2 영역, (0,1)만 disabled
    const pixels: (Pixel | null)[][] = [
      [
        { rowIndex: 0, columnIndex: 0, shape: null },
        { rowIndex: 0, columnIndex: 1, shape: null, disabled: true },
      ],
      [
        { rowIndex: 1, columnIndex: 0, shape: null },
        { rowIndex: 1, columnIndex: 1, shape: null },
      ],
    ];
    const area: SelectedArea = {
      startRow: 0,
      startCol: 0,
      endRow: 1,
      endCol: 1,
    };
    const flipped = flipPixelsHorizontal(pixels, area);
    // (0,1)은 disabled이므로 그대로, (0,0)은 (0,1)이 disabled이므로 null
    expect(flipped[0]?.[0]).toBeNull();
    expect(flipped[0]?.[1]?.disabled).toBe(true);
    // (1,0) <-> (1,1)은 정상 반전
    expect(flipped[1]?.[0]?.columnIndex).toBe(1);
    expect(flipped[1]?.[1]?.columnIndex).toBe(0);
  });
});
