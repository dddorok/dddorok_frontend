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

  const initialCells = convertCellsData(chart?.cells);
  // return <KnittingPatternEditor />;
  // return <KnittingPatternEditor />;

  console.log("initialCells: ", initialCells);
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
  // '●'에 해당하는 shape를 KNITTING_SYMBOLS에서 찾아 할당
  const dotShape = KNITTING_SYMBOLS.find((shape) => shape.id === "dot");
  console.log("KNITTING_SYMBOLS: ", KNITTING_SYMBOLS);
  return (
    cellsData?.map((cell) => ({
      row: cell.row,
      col: cell.col,
      shape: cell.symbol === "●" ? dotShape : undefined,
    })) ?? []
  );
};
