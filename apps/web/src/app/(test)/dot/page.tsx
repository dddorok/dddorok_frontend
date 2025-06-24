"use client";

import { useQuery } from "@tanstack/react-query";
// import KnittingPatternEditor from "./knitting";

import { KNITTING_SYMBOL_OBJ, KNITTING_SYMBOLS, Shape } from "./constant";
import PixelArtEditor from "./pixel-art-editor-demo";

import { projectQueries } from "@/queries/project";

export default function DotPage() {
  const { data: chart } = useQuery({
    ...projectQueries.chart("9c326ee7-1b8c-44fa-8eee-2c653f346af2"),
  });

  const chartShapeObj = chart?.cells.reduce(
    (acc, cell) => {
      acc[cell.symbol] = (acc[cell.symbol] || 0) + 1;
      // acc[cell.id] = cell;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("chartShapeObj: ", chartShapeObj);

  const initialCells = convertCellsData(chart?.cells);

  if (!initialCells || initialCells.length === 0) {
    return <div>Loading...</div>;
  }

  const maxRow = Math.max(...initialCells.map((cell) => cell.row));
  const maxCol = Math.max(...initialCells.map((cell) => cell.col));
  console.log("maxRow: ", maxRow, "maxCol: ", maxCol);

  return (
    <>
      <PixelArtEditor initialCells={initialCells} />
      <DevKnittingSymbolsPreview />
    </>
  );
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
  // const dotShape = KNITTING_SYMBOLS.find((shape) => shape.id === "dot");
  // console.log("KNITTING_SYMBOLS: ", KNITTING_SYMBOLS);
  return (
    cellsData?.map((cell) => ({
      row: cell.row,
      col: cell.col,
      shape:
        cell.symbol === undefined
          ? undefined
          : cell.symbol === "●"
            ? KNITTING_SYMBOL_OBJ.dot
            : cell.symbol === "✦"
              ? KNITTING_SYMBOL_OBJ.knit
              : KNITTING_SYMBOL_OBJ.dot,
    })) ?? []
  );
};

function DevKnittingSymbolsPreview() {
  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontWeight: "bold", marginBottom: 8 }}>
        KNITTING_SYMBOLS 미리보기 (DevTool)
      </h3>
      <div style={{ display: "flex", gap: 24 }}>
        {KNITTING_SYMBOLS.map((shape) => (
          <div key={shape.id} style={{ textAlign: "center" }}>
            <canvas
              width={40}
              height={40}
              ref={(canvas) => {
                if (canvas) {
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.clearRect(0, 0, 40, 40);
                    shape.render(ctx, 0, 0, 40, shape.color);
                  }
                }
              }}
              style={{
                border: "1px solid #eee",
                background: "#fff",
                borderRadius: 8,
              }}
            />
            <div style={{ fontSize: 12, marginTop: 4 }}>{shape.name}</div>
            <div style={{ fontSize: 10, color: "#888" }}>{shape.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
