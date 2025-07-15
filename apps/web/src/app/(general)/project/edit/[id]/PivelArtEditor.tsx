import { Redo, Redo2, Undo2 } from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  const { brushTool, selectedShape, selectionBackgroundColor } =
    usePixelArtEditorContext();
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

      <div
        className={cn(
          "fixed top-0 right-[calc(var(--container-layout-padding-inline)+60px)] z-50 h-[100px]",
          "flex gap-3 items-center"
        )}
      >
        <div className="flex gap-[32px]">
          <button
            onClick={() => dottingRef.current?.undo()}
            disabled={!dottingRef.current?.canUndo()}
            className="text-neutral-N700 disabled:text-neutral-N400"
          >
            <Undo2 width={32} height={32} />
          </button>
          <button
            onClick={() => dottingRef.current?.redo()}
            disabled={!dottingRef.current?.canRedo()}
            className="text-neutral-N700 disabled:text-neutral-N400"
          >
            <Redo2 width={32} height={32} />
          </button>
        </div>
        <Button color="fill" className="" onClick={handleSubmit}>
          저장하기
        </Button>
      </div>
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
        selectionBackgroundColor={selectionBackgroundColor}
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
