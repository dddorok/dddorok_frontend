import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from "react";

import {
  BrushTool,
  BrushToolType,
  KNITTING_SYMBOL_OBJ,
  Shape,
  DottingRef,
  useDotting,
} from "./index";

interface DottingContextType {
  brushTool: BrushToolType;
  setBrushTool: (tool: BrushToolType) => void;
  selectedShape: Shape;
  setSelectedShape: (shape: Shape) => void;
}

interface DottingHistoryContextType {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface DottingCopyContextType {
  copy: () => void;
  paste: () => void;
  cut: () => void;
  flipHorizontal: () => void;
  flipVertical: () => void;
}

interface DottingRefContextType {
  dottingRef: React.RefObject<DottingRef>;
}

const DottingRefContext = createContext<DottingRefContextType | undefined>(
  undefined
);

const DottingContext = createContext<DottingContextType | undefined>(undefined);

const DottingHistoryContext = createContext<
  DottingHistoryContextType | undefined
>(undefined);

const DottingCopyContext = createContext<DottingCopyContextType | undefined>(
  undefined
);

export const DottingProvider = ({ children }: { children: ReactNode }) => {
  const dottingRef = useRef<DottingRef | null>(
    null
  ) as React.RefObject<DottingRef>;

  const [brushTool, setBrushTool] = useState<BrushToolType>(BrushTool.DOT);
  const [selectedShape, setSelectedShape] = useState<Shape>(
    KNITTING_SYMBOL_OBJ.verticalLine as Shape
  );

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
    <DottingRefContext.Provider value={{ dottingRef }}>
      <DottingContext.Provider
        value={{
          brushTool,
          setBrushTool,
          selectedShape,
          setSelectedShape,
        }}
      >
        <DottingHistoryContext.Provider
          value={{
            undo,
            redo,
            canUndo,
            canRedo,
          }}
        >
          <DottingCopyContext.Provider
            value={{
              copy,
              paste: handlePaste,
              cut,
              flipHorizontal,
              flipVertical,
            }}
          >
            {children}
          </DottingCopyContext.Provider>
        </DottingHistoryContext.Provider>
      </DottingContext.Provider>
    </DottingRefContext.Provider>
  );
};

export const useDottingRef = () => {
  const context = useContext(DottingRefContext);
  if (!context)
    throw new Error("DottingRefContext must be used within DottingProvider");
  return context;
};

export const useDottingContext = () => {
  const context = useContext(DottingContext);
  if (!context)
    throw new Error("DottingContext must be used within DottingProvider");
  return context;
};

export const useDottingHistoryContext = () => {
  const context = useContext(DottingHistoryContext);
  if (!context)
    throw new Error(
      "DottingHistoryContext must be used within DottingProvider"
    );
  return context;
};

export const useDottingCopyContext = () => {
  const context = useContext(DottingCopyContext);
  if (!context)
    throw new Error("DottingCopyContext must be used within DottingProvider");
  return context;
};
