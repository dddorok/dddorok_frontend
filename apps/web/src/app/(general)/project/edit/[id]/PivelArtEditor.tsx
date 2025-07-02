import React from "react";

import Toolbar from "./_components/Toolbar";
import { DottingProvider } from "./Dotting";
import { CellDataType, DisabledCellDataType } from "./Dotting/Cell.tyles";
import { Dotting } from "./Dotting/Dotting";
import { KNITTING_SYMBOLS } from "./Dotting/Shape.constants";

interface PixelArtEditorProps {
  initialCells: CellDataType[];
  disabledCells: DisabledCellDataType[];
  grid_col: number;
  grid_row: number;
}

const PixelArtEditor = ({
  initialCells,
  grid_col,
  disabledCells,
  grid_row,
}: PixelArtEditorProps) => {
  return (
    <DottingProvider>
      <div className="w-fit">
        <Toolbar />
        <Dotting
          rows={grid_row}
          cols={grid_col}
          gridSquareLength={20}
          shapes={KNITTING_SYMBOLS}
          backgroundColor="#fff"
          gridStrokeColor="#e9ecef"
          isPanZoomable={false}
          initialCells={initialCells}
          disabledCells={disabledCells}
        />
      </div>
    </DottingProvider>
  );
};

export default PixelArtEditor;
