import type { Pixel, SelectedArea } from "../Dotting";

export function flipPixelsHorizontal(
  pixels: (Pixel | null)[][],
  area: SelectedArea
): (Pixel | null)[][] {
  const newPixels = pixels.map((row) => [...row]);
  for (let row = area.startRow; row <= area.endRow; row++) {
    const baseRow = [...(newPixels[row] ?? [])];
    const areaSlice = baseRow
      .slice(area.startCol, area.endCol + 1)
      .map((p) => (p === undefined ? null : p));
    for (let i = 0; i < areaSlice.length; i++) {
      const col = area.startCol + i;
      if (!baseRow[col]?.disabled) {
        baseRow[col] = areaSlice[areaSlice.length - 1 - i] ?? null;
      }
    }
    newPixels[row] = baseRow;
  }
  return newPixels;
}

export function flipPixelsVertical(
  pixels: (Pixel | null)[][],
  area: SelectedArea
): (Pixel | null)[][] {
  const newPixels = pixels.map((row) => [...row]);
  const areaRows: (Pixel | null)[][] = [];
  for (let row = area.startRow; row <= area.endRow; row++) {
    const baseRow = [...(newPixels[row] ?? [])];
    areaRows.push(
      baseRow
        .slice(area.startCol, area.endCol + 1)
        .map((p) => (p === undefined ? null : p))
    );
  }
  for (let i = 0; i < areaRows.length; i++) {
    const targetRow = area.startRow + i;
    const sourceRow = areaRows.length - 1 - i;
    const baseRow = [...(newPixels[targetRow] ?? [])];
    for (let j = 0; j < (areaRows[sourceRow]?.length ?? 0); j++) {
      const col = area.startCol + j;
      if (!baseRow[col]?.disabled) {
        baseRow[col] = (areaRows[sourceRow] ?? [])[j] ?? null;
      }
    }
    newPixels[targetRow] = baseRow;
  }
  return newPixels;
}
