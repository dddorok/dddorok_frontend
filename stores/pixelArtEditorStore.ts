import { create } from "zustand";
import { BrushToolType } from "../apps/web/src/app/(test)/dot/constant";
import {
  KNITTING_SYMBOLS,
  Shape,
} from "../apps/web/src/app/(test)/dot/Shape.constants";

export interface PixelArtEditorStoreState {
  brushTool: BrushToolType;
  setBrushTool: (tool: BrushToolType) => void;
  selectedShape: Shape;
  setSelectedShape: (shape: Shape) => void;
  shapes: Shape[];
  setShapes: (shapes: Shape[]) => void;
  addShape: (shape: Shape) => void;
}

export const usePixelArtEditorStore = create<PixelArtEditorStoreState>(
  (set) => ({
    brushTool: "dot",
    setBrushTool: (tool) => set({ brushTool: tool }),
    selectedShape: KNITTING_SYMBOLS[0],
    setSelectedShape: (shape) => set({ selectedShape: shape }),
    shapes: KNITTING_SYMBOLS,
    setShapes: (shapes) => set({ shapes }),
    addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  })
);
