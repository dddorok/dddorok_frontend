import React, { useRef } from "react";

import Toolbar from "./_components/Toolbar";
import { Cell } from "./chart.types";
import { DottingProvider } from "./Dotting";
import { Dotting } from "./Dotting/Dotting";
import { KNITTING_SYMBOLS } from "./Dotting/Shape.constants";
import { DottingRef } from "./Dotting/useDotting";
import {
  usePixelArtEditorContext,
  PixelArtEditorProvider,
} from "./PixelArtEditorContext";

interface PixelArtEditorProps {
  initialCells: Cell[];
  disabledCells: Cell[];
  grid_col: number;
  grid_row: number;
  // dottingRef: React.RefObject<DottingRef>;
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

// PixelArtEditorProvider로 PixelArtEditor를 감싸서 export
// const PixelArtEditorWithProvider = (props: any) => {
//   const dottingRef = useRef<DottingRef | null>(null);
//   return (
//     // <PixelArtEditorProvider dottingRef={dottingRef}>
//     <PixelArtEditor {...props} />
//     // </PixelArtEditorProvider>
//   );
// };

export default PixelArtEditor;
