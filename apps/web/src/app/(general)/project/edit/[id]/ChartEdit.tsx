import { Cell } from "./chart.types";
import PixelArtEditor from "./PivelArtEditor";
import { KNITTING_SYMBOL_OBJ } from "./Shape.constants";

import { OriginalCell } from "@/services/project";

export default function ChartEdit({
  grid_row,
  grid_col,
  cells,
  onSubmit,
}: {
  grid_row: number;
  grid_col: number;
  cells: OriginalCell[];
  onSubmit: (cells: OriginalCell[]) => void;
}) {
  const { initialCells } = convertCellsData(cells);
  const disabledCells = getDisabledCells(grid_row, grid_col, initialCells);

  if (!initialCells) {
    return (
      <div className="flex justify-center items-center h-40 bg-neutral-N0 rounded-2xl text-neutral-N500 text-h3 font-medium">
        cell 로드에 실패했습니다.
      </div>
    );
  }

  return (
    <PixelArtEditor
      onSubmit={onSubmit}
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

  const convertedCells = cellsData?.map((cell) => {
    if (cell.symbol === undefined) {
      return {
        row: cell.row,
        col: cell.col,
        shape: undefined,
      };
    }

    return {
      row: cell.row,
      col: cell.col,
      shape: Object.keys(KNITTING_SYMBOL_OBJ).find(
        (key) => KNITTING_SYMBOL_OBJ[key]?.id === cell.symbol
      )
        ? KNITTING_SYMBOL_OBJ[cell.symbol]
        : undefined,
    };
  });

  return { initialCells: convertedCells };
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
