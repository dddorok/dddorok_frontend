import React, { useState, useCallback } from "react";

import { Shape } from "./constant";

interface Pixel {
  rowIndex: number;
  columnIndex: number;
  shape: Shape | null;
  disabled?: boolean; // 비활성화 셀 여부
}

export interface DottingRef {
  clear: () => void;
  getPixels: () => (Pixel | null)[][];
  setPixels: (newPixels: (Pixel | null)[][]) => void;
  exportImage: () => string;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useDotting = (ref: React.RefObject<DottingRef | null>) => {
  const [canUndoState, setCanUndoState] = useState(false);
  const [canRedoState, setCanRedoState] = useState(false);

  // 상태 업데이트를 위한 함수
  const updateUndoRedoState = useCallback(() => {
    if (ref.current) {
      setCanUndoState(ref.current.canUndo());
      setCanRedoState(ref.current.canRedo());
    }
  }, [ref]);

  // 마우스 이벤트 리스너를 추가하여 그리기 완료 감지
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setTimeout(updateUndoRedoState, 100);
    };

    const handleGlobalClick = () => {
      setTimeout(updateUndoRedoState, 100);
    };

    // 주기적 업데이트 (더 긴 간격으로)
    const interval = setInterval(updateUndoRedoState, 500);

    // 전역 이벤트 리스너 추가
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("click", handleGlobalClick);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [updateUndoRedoState]);

  const clear = useCallback(() => {
    if (ref.current) {
      ref.current.clear();
      setTimeout(updateUndoRedoState, 50);
    }
  }, [ref, updateUndoRedoState]);

  const getPixels = useCallback(() => {
    if (ref.current) {
      return ref.current.getPixels();
    }
    return [];
  }, [ref]);

  const exportImage = useCallback(() => {
    if (ref.current) {
      return ref.current.exportImage();
    }
    return null;
  }, [ref]);

  const undo = useCallback(() => {
    if (ref.current) {
      ref.current.undo();
      setTimeout(updateUndoRedoState, 10);
    }
  }, [ref, updateUndoRedoState]);

  const redo = useCallback(() => {
    if (ref.current) {
      ref.current.redo();
      setTimeout(updateUndoRedoState, 10);
    }
  }, [ref, updateUndoRedoState]);

  return {
    clear,
    getPixels,
    exportImage,
    undo,
    redo,
    canUndo: canUndoState,
    canRedo: canRedoState,
  };
};
