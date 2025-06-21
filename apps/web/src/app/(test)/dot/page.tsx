"use client";

import { useQuery } from "@tanstack/react-query";
// import KnittingPatternEditor from "./knitting";

import { KNITTING_SYMBOLS, Shape } from "./constant";
import PixelArtEditor from "./pixel-art-editor-demo";

import { projectQueries } from "@/queries/project";

export default function DotPage() {
  const { data: chart } = useQuery({
    ...projectQueries.chart("9c326ee7-1b8c-44fa-8eee-2c653f346af2"),
  });

  console.log("chart: ", chart);
  const initialCells = convertCellsData(chart?.cells);
  console.log("initialCells: ", initialCells);
  // return <KnittingPatternEditor />;
  // return <KnittingPatternEditor />;

  if (!initialCells || initialCells.length === 0) {
    return <div>Loading...</div>;
  }

  const maxRow = Math.max(...initialCells.map((cell) => cell.row));
  const maxCol = Math.max(...initialCells.map((cell) => cell.col));
  console.log("maxRow: ", maxRow, "maxCol: ", maxCol);

  return <PixelArtEditor initialCells={initialCells} />;
}

interface Cell {
  row: number;
  col: number;
  shape: Shape | undefined;
}

interface OriginalCell {
  row: number;
  col: number;
  symbol: string;
  color_code: string;
}

// 동적 변환 함수
const convertCellsData = (cellsData: OriginalCell[] | undefined): Cell[] => {
  return (
    cellsData?.map((cell) => ({
      row: cell.row,
      col: cell.col,
      // shape: getSymbolByCode(cell.symbol),
      shape: cell.symbol === "●" ? KNITTING_SYMBOLS[0] : undefined,
    })) ?? []
  );
};
