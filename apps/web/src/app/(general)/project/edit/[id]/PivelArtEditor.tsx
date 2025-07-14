import { gzipSync, strToU8 } from "fflate";
import React, { useRef } from "react";

import Toolbar from "./_components/Toolbar";
import { Cell } from "./chart.types";
import { Dotting } from "./Dotting";
import {
  usePixelArtEditorContext,
  PixelArtEditorProvider,
} from "./PixelArtEditorContext";
import { KNITTING_SYMBOLS } from "./Shape.constants";
import { DottingRef } from "./useDotting";

import { OriginalCell, updateChart } from "@/services/project";

const MAX_GRID_SIZE = 1000;

const PixelArtEditor = ({
  initialCells,
  grid_col,
  disabledCells,
  grid_row,
  dottingRef,
  onSubmit,
}: {
  initialCells: Cell[];
  disabledCells: Cell[];
  grid_col: number;
  grid_row: number;
  dottingRef: React.RefObject<DottingRef>;
  onSubmit: (cells: OriginalCell[]) => void;
}) => {
  const { brushTool, selectedShape } = usePixelArtEditorContext();
  const handleSubmit = async () => {
    const pixels = dottingRef.current?.getPixels();
    if (!pixels) return;

    const data = pixels
      .map((row) =>
        row
          .filter((pixel) => pixel !== null && !pixel.disabled)
          .filter((pixel) => pixel !== null)
          .map((pixel) => ({
            row: pixel.rowIndex,
            col: pixel.columnIndex,
            symbol: pixel.shape?.id,
            color_code: pixel.shape?.color,
          }))
          .flat()
      )
      .flat();

    console.log("data: ", data);

    onSubmit(data);
  };

  if (grid_col >= MAX_GRID_SIZE || grid_row >= MAX_GRID_SIZE) {
    return (
      <div className="flex justify-center items-center h-40 bg-neutral-N0 rounded-2xl text-neutral-N500 text-h3 font-medium">
        차트가 너무 커서 렌더링 할 수 없습니다. 관리자에게 문의 부탁드립니다
      </div>
    );
  }

  return (
    <div className="w-fit">
      <Toolbar />

      <button onClick={handleSubmit}>저장</button>

      <Dotting
        ref={dottingRef}
        rows={grid_row}
        cols={grid_col}
        gridSquareLength={20}
        brushTool={brushTool}
        selectedShape={selectedShape}
        shapes={KNITTING_SYMBOLS}
        backgroundColor="#fff"
        gridStrokeColor="#e9ecef"
        isPanZoomable={false}
        // zoomSensitivity={0.1}
        initialCells={initialCells}
        disabledCells={disabledCells}
      />
    </div>
  );
};

// PixelArtEditorProvider로 PixelArtEditor를 감싸서 export
const PixelArtEditorWithProvider = (props: any) => {
  const dottingRef = useRef<DottingRef | null>(null);
  return (
    <PixelArtEditorProvider dottingRef={dottingRef}>
      <PixelArtEditor {...props} dottingRef={dottingRef} />
    </PixelArtEditorProvider>
  );
};

export default PixelArtEditorWithProvider;
