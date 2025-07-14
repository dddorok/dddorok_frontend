import { describe, it, expect } from "vitest";

import { interpolatePixels } from "./Dotting";

import type { SelectedArea, Pixel } from "./Dotting";

// interpolatePixels 테스트

describe("interpolatePixels", () => {
  it("대각선 픽셀 배열을 올바르게 반환한다", () => {
    const result = interpolatePixels(0, 0, 2, 2, null);
    // (0,0), (1,1), (2,2) 총 3개
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

// canDrawOnCell 테스트 (Dotting에서 export 필요)
// import { canDrawOnCell } from './Dotting';
// describe('canDrawOnCell', () => {
//   it('비활성화 셀에는 그릴 수 없다', () => {
//     // ...테스트 코드
//   });
// });
