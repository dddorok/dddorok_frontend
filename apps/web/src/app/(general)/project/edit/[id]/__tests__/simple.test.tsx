import { describe, it, expect } from "vitest";

describe("jsdom 환경 테스트", () => {
  it("DOM API가 사용 가능하다", () => {
    const div = document.createElement("div");
    expect(div).toBeDefined();
    expect(div.tagName).toBe("DIV");
  });

  it("Canvas API가 사용 가능하다", () => {
    const canvas = document.createElement("canvas");
    expect(canvas).toBeDefined();
    expect(canvas.tagName).toBe("CANVAS");

    // getContext가 호출되는지 확인
    const ctx = canvas.getContext("2d");
    expect(ctx).toBeDefined();
  });
});
