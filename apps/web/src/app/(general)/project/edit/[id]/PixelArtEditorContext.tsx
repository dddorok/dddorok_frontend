import React, { createContext, useContext, useState, ReactNode } from "react";

import {
  BrushToolType,
  BrushTool,
  SELECTION_BACKGROUND_COLORS,
  SelectionBackgroundColorType,
} from "./constant";
import { KNITTING_SYMBOL_OBJ, Shape } from "./Shape.constants";
import { DottingRef, useDotting } from "./useDotting";

interface PixelArtEditorContextType {
  brushTool: BrushToolType;
  setBrushTool: (tool: BrushToolType) => void;
  selectedShape: Shape;
  setSelectedShape: (shape: Shape) => void;
  selectionBackgroundColor: SelectionBackgroundColorType;
  setSelectionBackgroundColor: (color: SelectionBackgroundColorType) => void;
}

interface PixelArtEditorHistoryContextType {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface PixelArtEditorCopyContextType {
  copy: () => void;
  paste: () => void;
  cut: () => void;
  flipHorizontal: () => void;
  flipVertical: () => void;
}

const PixelArtEditorContext = createContext<
  PixelArtEditorContextType | undefined
>(undefined);

const PixelArtEditorHistoryContext = createContext<
  PixelArtEditorHistoryContextType | undefined
>(undefined);

const PixelArtEditorCopyContext = createContext<
  PixelArtEditorCopyContextType | undefined
>(undefined);

export const PixelArtEditorProvider = ({
  children,
  dottingRef,
}: {
  children: ReactNode;
  dottingRef: React.RefObject<DottingRef | null>;
}) => {
  const [brushTool, setBrushTool] = useState<BrushToolType>(BrushTool.DOT);
  const [selectedShape, setSelectedShape] = useState<Shape>(
    KNITTING_SYMBOL_OBJ.verticalLine as Shape
  );
  const [selectionBackgroundColor, setSelectionBackgroundColor] =
    useState<SelectionBackgroundColorType>(SELECTION_BACKGROUND_COLORS.DEFAULT);

  const {
    clear,
    exportImage,
    undo,
    redo,
    canUndo,
    canRedo,
    copy,
    handlePaste,
    cut,
    flipHorizontal,
    flipVertical,
  } = useDotting(dottingRef);

  // 키보드 단축키 추가
  // TODO: 이후에 라이브러리로 교체
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        e.preventDefault();
        copy();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "v") {
        e.preventDefault();
        handlePaste();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "x") {
        e.preventDefault();
        cut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, copy, handlePaste, cut]);

  return (
    <PixelArtEditorContext.Provider
      value={{
        brushTool,
        setBrushTool,
        selectedShape,
        setSelectedShape,
        selectionBackgroundColor,
        setSelectionBackgroundColor,
      }}
    >
      <PixelArtEditorHistoryContext.Provider
        value={{
          undo,
          redo,
          canUndo,
          canRedo,
        }}
      >
        <PixelArtEditorCopyContext.Provider
          value={{
            copy,
            paste: handlePaste,
            cut,
            flipHorizontal,
            flipVertical,
          }}
        >
          {children}
        </PixelArtEditorCopyContext.Provider>
      </PixelArtEditorHistoryContext.Provider>
    </PixelArtEditorContext.Provider>
  );
};

export const usePixelArtEditorContext = () => {
  const context = useContext(PixelArtEditorContext);
  if (!context)
    throw new Error(
      "PixelArtEditorContext must be used within PixelArtEditorProvider"
    );
  return context;
};

export const usePixelArtEditorHistoryContext = () => {
  const context = useContext(PixelArtEditorHistoryContext);
  if (!context)
    throw new Error(
      "PixelArtEditorHistoryContext must be used within PixelArtEditorProvider"
    );
  return context;
};

export const usePixelArtEditorCopyContext = () => {
  const context = useContext(PixelArtEditorCopyContext);
  if (!context)
    throw new Error(
      "PixelArtEditorCopyContext must be used within PixelArtEditorProvider"
    );
  return context;
};
