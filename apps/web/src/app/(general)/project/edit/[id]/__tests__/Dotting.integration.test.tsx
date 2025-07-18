import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { BrushTool } from "../constant";
import { Dotting } from "../Dotting";
import {
  createTestShape,
  createTestPixels,
  createTestSelectedArea,
  createTestCopiedArea,
  mockShapes,
  TEST_CONSTANTS,
} from "./test-helpers";

// Canvas API 모킹
const mockContext = {
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  fillStyle: "",
  fillRect: vi.fn(),
  strokeStyle: "",
  lineWidth: 0,
  setLineDash: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  closePath: vi.fn(),
  globalAlpha: 1,
};

const mockCanvas = {
  getContext: vi.fn(() => mockContext),
  getBoundingClientRect: vi.fn(() => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  })),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  width: 100,
  height: 100,
};

// ResizeObserver 모킹
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// IntersectionObserver 모킹
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// matchMedia 모킹
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Dotting 컴포넌트 통합 테스트", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Canvas 모킹 설정
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: vi.fn(() => mockContext),
    });

    Object.defineProperty(
      HTMLCanvasElement.prototype,
      "getBoundingClientRect",
      {
        value: vi.fn(() => ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
        })),
      }
    );
  });

  it("컴포넌트가 올바르게 렌더링된다", () => {
    render(<Dotting rows={5} cols={5} />);
    const canvas = screen.getByRole("img", { hidden: true });
    expect(canvas).toBeInTheDocument();
  });

  it("마우스 이벤트가 올바르게 처리된다", async () => {
    const ref = React.createRef<any>();
    render(<Dotting ref={ref} rows={3} cols={3} brushTool={BrushTool.DOT} />);

    const canvas = screen.getByRole("img", { hidden: true });

    // 마우스 다운 이벤트
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });

    await waitFor(() => {
      const pixels = ref.current?.getPixels();
      expect(pixels).toBeDefined();
    });
  });

  it("비활성화 셀에 그리기가 차단된다", async () => {
    const ref = React.createRef<any>();
    const disabledCells = [{ row: 0, col: 1 }];

    render(
      <Dotting
        ref={ref}
        rows={2}
        cols={2}
        brushTool={BrushTool.DOT}
        disabledCells={disabledCells}
      />
    );

    const canvas = screen.getByRole("img", { hidden: true });

    // 비활성화된 셀 (0,1)에 그리기 시도
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 10 });

    await waitFor(() => {
      const pixels = ref.current?.getPixels();
      // 비활성화된 셀에는 그려지지 않아야 함
      expect(pixels[0]?.[1]?.disabled).toBe(true);
      expect(pixels[0]?.[1]?.shape).toBeNull();
    });
  });

  it("ref 메서드들이 올바르게 동작한다", () => {
    const ref = React.createRef<any>();
    render(<Dotting ref={ref} rows={2} cols={2} />);

    expect(ref.current).toBeDefined();
    expect(typeof ref.current.clear).toBe("function");
    expect(typeof ref.current.getPixels).toBe("function");
    expect(typeof ref.current.setPixels).toBe("function");
    expect(typeof ref.current.undo).toBe("function");
    expect(typeof ref.current.redo).toBe("function");
  });

  it("undo/redo 기능이 올바르게 동작한다", async () => {
    const ref = React.createRef<any>();
    render(<Dotting ref={ref} rows={2} cols={2} brushTool={BrushTool.DOT} />);

    const canvas = screen.getByRole("img", { hidden: true });

    // 초기 상태에서 undo 불가능
    expect(ref.current?.canUndo()).toBe(false);

    // 그리기 수행
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });

    await waitFor(() => {
      expect(ref.current?.canUndo()).toBe(true);
    });

    // undo 수행
    ref.current?.undo();

    await waitFor(() => {
      expect(ref.current?.canUndo()).toBe(false);
    });
  });

  it("선택 영역 기능이 올바르게 동작한다", async () => {
    const ref = React.createRef<any>();
    render(
      <Dotting ref={ref} rows={3} cols={3} brushTool={BrushTool.SELECT} />
    );

    const canvas = screen.getByRole("img", { hidden: true });

    // 선택 영역 생성
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(canvas);

    await waitFor(() => {
      const selectedArea = ref.current?.getSelectedArea();
      expect(selectedArea).toBeDefined();
      expect(selectedArea?.startRow).toBe(1);
      expect(selectedArea?.startCol).toBe(1);
    });
  });

  it("복사/붙여넣기 기능이 올바르게 동작한다", async () => {
    const ref = React.createRef<any>();
    render(
      <Dotting ref={ref} rows={3} cols={3} brushTool={BrushTool.SELECT} />
    );

    const canvas = screen.getByRole("img", { hidden: true });

    // 선택 영역 생성
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(canvas);

    await waitFor(() => {
      const selectedArea = ref.current?.getSelectedArea();
      expect(selectedArea).toBeDefined();
    });

    // 복사 수행
    const copiedArea = ref.current?.copySelectedArea(1, 1, 1, 1);
    expect(copiedArea).toBeDefined();

    // 붙여넣기 수행
    ref.current?.pasteArea(0, 0, copiedArea);

    await waitFor(() => {
      const pixels = ref.current?.getPixels();
      expect(pixels[0]?.[0]).toBeDefined();
    });
  });

  it("좌우/상하 뒤집기 기능이 올바르게 동작한다", async () => {
    const ref = React.createRef<any>();
    render(
      <Dotting ref={ref} rows={2} cols={2} brushTool={BrushTool.SELECT} />
    );

    const canvas = screen.getByRole("img", { hidden: true });

    // 선택 영역 생성
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(canvas);

    await waitFor(() => {
      const selectedArea = ref.current?.getSelectedArea();
      expect(selectedArea).toBeDefined();
    });

    // 좌우 뒤집기
    ref.current?.flipHorizontal();

    // 상하 뒤집기
    ref.current?.flipVertical();

    await waitFor(() => {
      const pixels = ref.current?.getPixels();
      expect(pixels).toBeDefined();
    });
  });

  it("패닝과 줌 기능이 올바르게 동작한다", () => {
    const ref = React.createRef<any>();
    render(<Dotting ref={ref} rows={2} cols={2} isPanZoomable={true} />);

    const canvas = screen.getByRole("img", { hidden: true });

    // 패닝 정보 가져오기
    const panZoomInfo = ref.current?.getPanZoomInfo();
    expect(panZoomInfo).toBeDefined();
    expect(panZoomInfo.panOffset).toBeDefined();
    expect(panZoomInfo.scale).toBe(1);

    // 그리드 위치 계산
    const gridPos = ref.current?.getGridPosition(30, 30);
    expect(gridPos).toBeDefined();
    expect(gridPos.row).toBeGreaterThanOrEqual(0);
    expect(gridPos.col).toBeGreaterThanOrEqual(0);
  });

  it("다양한 브러시 도구가 올바르게 동작한다", async () => {
    const ref = React.createRef<any>();
    const { rerender } = render(<Dotting ref={ref} rows={2} cols={2} />);

    const canvas = screen.getByRole("img", { hidden: true });

    // DOT 브러시
    rerender(<Dotting ref={ref} rows={2} cols={2} brushTool={BrushTool.DOT} />);
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });

    // ERASER 브러시
    rerender(
      <Dotting ref={ref} rows={2} cols={2} brushTool={BrushTool.ERASER} />
    );
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });

    // LINE 브러시
    rerender(
      <Dotting ref={ref} rows={2} cols={2} brushTool={BrushTool.LINE} />
    );
    fireEvent.mouseDown(canvas, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(canvas);

    await waitFor(() => {
      const pixels = ref.current?.getPixels();
      expect(pixels).toBeDefined();
    });
  });

  it("초기 셀과 비활성화 셀이 올바르게 설정된다", () => {
    const ref = React.createRef<any>();
    const initialCells = [
      { row: 0, col: 0, shape: createTestShape("initial") },
    ];
    const disabledCells = [{ row: 0, col: 1 }];

    render(
      <Dotting
        ref={ref}
        rows={2}
        cols={2}
        initialCells={initialCells}
        disabledCells={disabledCells}
      />
    );

    const pixels = ref.current?.getPixels();
    expect(pixels[0]?.[0]?.shape?.id).toBe("initial");
    expect(pixels[0]?.[1]?.disabled).toBe(true);
  });

  it("이미지 내보내기 기능이 올바르게 동작한다", () => {
    const ref = React.createRef<any>();
    render(<Dotting ref={ref} rows={2} cols={2} />);

    const imageData = ref.current?.exportImage();
    expect(typeof imageData).toBe("string");
    expect(imageData.startsWith("data:image/")).toBe(true);
  });
});
