import { KNITTING_SYMBOL_OBJ, KNITTING_SYMBOLS, Shape } from "./constant";
import PixelArtEditor from "./pixel-art-editor-demo";

import { OriginalCell } from "@/services/project";

export default function ChartEdit({
  chart,
}: {
  chart: {
    grid_row: number;
    grid_col: number;
    cells: OriginalCell[];
  };
}) {
  const { initialCells } = convertCellsData(chart?.cells);
  const disabledCells = getDisabledCells(
    chart.grid_row,
    chart.grid_col,
    initialCells
  );

  if (!initialCells || initialCells.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PixelArtEditor
        initialCells={initialCells}
        disabledCells={disabledCells}
        grid_col={chart.grid_col}
        grid_row={chart.grid_row}
      />
      <DevKnittingSymbolsPreview />
    </div>
  );
}

interface Cell {
  row: number;
  col: number;
  shape: Shape | undefined;
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
            ? KNITTING_SYMBOL_OBJ.knit
            : KNITTING_SYMBOL_OBJ.dot,
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
