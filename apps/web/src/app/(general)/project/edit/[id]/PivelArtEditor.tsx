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

const PixelArtEditor = ({
  initialCells,
  grid_col,
  disabledCells,
  grid_row,
  dottingRef,
}: {
  initialCells: Cell[];
  disabledCells: Cell[];
  grid_col: number;
  grid_row: number;
  dottingRef: React.RefObject<DottingRef>;
}) => {
  const { brushTool, selectedShape } = usePixelArtEditorContext();

  return (
    <div className="w-fit">
      <Toolbar />

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
