import React, { useState, useCallback } from "react";

import { Shape } from "./constant";

interface Pixel {
  rowIndex: number;
  columnIndex: number;
  shape: Shape | null;
  disabled?: boolean; // 비활성화 셀 여부
}

// 복사된 영역 데이터 타입
interface CopiedArea {
  pixels: (Pixel | null)[][];
  width: number;
  height: number;
  startRow: number;
  startCol: number;
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
  copySelectedArea: (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) => CopiedArea | null;
  pasteArea: (
    targetRow: number,
    targetCol: number,
    copiedArea: CopiedArea
  ) => void;
  getSelectedArea: () => {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } | null;
  getPanZoomInfo: () => { panOffset: { x: number; y: number }; scale: number };
  getGridPosition: (
    canvasX: number,
    canvasY: number
  ) => { row: number; col: number };
  getCanvasPosition: () => { x: number; y: number } | null;
  copy: () => void;
  getCopiedArea: () => CopiedArea | null;
  handlePaste: () => void;
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

  // 복사 기능
  const copy = useCallback(() => {
    if (ref.current) {
      ref.current.copy();
    }
  }, [ref]);

  // 붙여넣기 기능 (더 이상 필요하지 않음 - Dotting 컴포넌트에서 직접 처리)
  const paste = useCallback(() => {
    // 붙여넣기는 이제 Dotting 컴포넌트에서 직접 처리됨
    console.log("붙여넣기는 Dotting 컴포넌트에서 직접 처리됩니다.");
  }, []);

  // 복사된 영역 가져오기
  const getCopiedArea = useCallback(() => {
    if (ref.current) {
      return ref.current.getCopiedArea();
    }
    return null;
  }, [ref]);

  // 붙여넣기 모드 토글
  // const togglePasteMode = useCallback(() => {
  //   if (ref.current) {
  //     ref.current.togglePasteMode();
  //   }
  // }, [ref]);

  const handlePaste = useCallback(() => {
    if (ref.current) {
      ref.current.handlePaste();
    }
  }, [ref]);

  return {
    clear,
    getPixels,
    exportImage,
    undo,
    redo,
    canUndo: canUndoState,
    canRedo: canRedoState,
    copy,
    paste,
    copiedArea: getCopiedArea(),
    handlePaste,
  };
};
