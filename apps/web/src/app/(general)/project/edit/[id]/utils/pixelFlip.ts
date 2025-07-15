import type { Pixel, SelectedArea } from "./pixelUtils";

export function flipPixelsHorizontal(
  pixels: (Pixel | null)[][],
  area: SelectedArea
): (Pixel | null)[][] {
  const newPixels = pixels.map((row) => [...row]);
  for (let row = area.startRow; row <= area.endRow; row++) {
    if (!newPixels[row]) newPixels[row] = [];
    const baseRow = [...(newPixels[row] ?? [])];
    for (let col = area.startCol; col <= area.endCol; col++) {
      const pixel = pixels[row]?.[col] ?? null;
      const isDisabled = pixel?.disabled;
      const mirrorCol = area.startCol + (area.endCol - col);
      const mirrorPixel = pixels[row]?.[mirrorCol] ?? null;
      const mirrorIsDisabled = mirrorPixel?.disabled;

      if (isDisabled) {
        baseRow[col] = pixel;
      } else if (mirrorIsDisabled) {
        baseRow[col] = null;
      } else {
        if (mirrorPixel) {
          baseRow[col] = {
            ...mirrorPixel,
            columnIndex: mirrorCol,
          };
        } else {
          baseRow[col] = null;
        }
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
  for (let col = area.startCol; col <= area.endCol; col++) {
    for (let row = area.startRow; row <= area.endRow; row++) {
      if (!newPixels[row]) newPixels[row] = [];
      const pixel = pixels[row]?.[col] ?? null;
      const isDisabled = pixel?.disabled;
      const mirrorRow = area.startRow + (area.endRow - row);
      const mirrorPixel = pixels[mirrorRow]?.[col] ?? null;
      const mirrorIsDisabled = mirrorPixel?.disabled;

      if (isDisabled) {
        (newPixels[row as number] as Pixel[])[col] = pixel;
      } else if (mirrorIsDisabled) {
        (newPixels[row as number] as (Pixel | null)[])[col] = null;
      } else {
        if (mirrorPixel) {
          (newPixels[row as number] as (Pixel | null)[])[col] = {
            ...mirrorPixel,
            rowIndex: row,
            columnIndex: col,
          };
        } else {
          (newPixels[row as number] as (Pixel | null)[])[col] = null;
        }
      }
    }
  }
  return newPixels;
}
