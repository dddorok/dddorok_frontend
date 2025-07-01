import { Cell } from "./chart.types";
import PixelArtEditor from "./PivelArtEditor";
import { KNITTING_SYMBOL_OBJ, KNITTING_SYMBOLS } from "./Shape.constants";

import { OriginalCell } from "@/services/project";

export default function ChartEdit({
  grid_row,
  grid_col,
  cells,
}: {
  grid_row: number;
  grid_col: number;
  cells: OriginalCell[];
  // chart: {
  //   grid_row: number;
  //   grid_col: number;
  //   cells: OriginalCell[];
  // };
}) {
  const { initialCells } = convertCellsData(cells);
  const disabledCells = getDisabledCells(grid_row, grid_col, initialCells);

  if (!initialCells || initialCells.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <PixelArtEditor
      initialCells={initialCells}
      disabledCells={disabledCells}
      grid_col={grid_col}
      grid_row={grid_row}
    />
  );
}

// 동적 변환 함수
const convertCellsData = (
  cellsData: OriginalCell[] | undefined
): { initialCells: Cell[] } => {
  if (!cellsData) {
    return { initialCells: [] };
  }

  const convertedCells = cellsData?.map((cell) => ({
    row: cell.row,
    col: cell.col,
    shape:
      cell.symbol === undefined
        ? undefined
        : cell.symbol === "●"
          ? KNITTING_SYMBOL_OBJ.dot
          : cell.symbol === "✦"
            ? KNITTING_SYMBOL_OBJ.diagonalLine
            : KNITTING_SYMBOL_OBJ.diamond,
  }));

  const initialCells = convertedCells?.filter(
    (cell) => cell.shape !== undefined
  );

  return { initialCells };
};

const getDisabledCells = (
  grid_row: number,
  grid_col: number,
  initialCells: Cell[]
): Cell[] => {
  const initialSet = new Set(
    initialCells.map((cell) => `${cell.row},${cell.col}`)
  );
  return Array.from({ length: grid_row * grid_col }, (_, idx) => {
    const row = Math.floor(idx / grid_col);
    const col = idx % grid_col;
    return { row, col, shape: undefined };
  }).filter((cell) => !initialSet.has(`${cell.row},${cell.col}`));
};
