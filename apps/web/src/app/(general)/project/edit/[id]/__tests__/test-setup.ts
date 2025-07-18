// 테스트 환경 설정
import "@testing-library/jest-dom";

// Canvas 모킹
const mockCanvas = {
  getContext: jest.fn(() => ({
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    fillStyle: "",
    fillRect: jest.fn(),
    strokeStyle: "",
    lineWidth: 0,
    setLineDash: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    globalAlpha: 0,
  })),
  getBoundingClientRect: jest.fn(() => ({
    left: 0,
    top: 0,
  })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

Object.defineProperty(global, "HTMLCanvasElement", {
  value: class {
    getContext = mockCanvas.getContext;
    getBoundingClientRect = mockCanvas.getBoundingClientRect;
    addEventListener = mockCanvas.addEventListener;
    removeEventListener = mockCanvas.removeEventListener;
    width = 0;
    height = 0;
  },
});

// ResizeObserver 모킹
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// IntersectionObserver 모킹
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// window.matchMedia 모킹
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// console.warn과 console.error를 무시 (테스트 중 불필요한 출력 방지)
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
