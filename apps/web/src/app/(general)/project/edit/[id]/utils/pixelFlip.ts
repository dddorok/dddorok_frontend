import { createEmptyPixel } from "./pixelUtils";

import type { Pixel, SelectedArea } from "./pixelUtils";

export function flipPixelsHorizontal(
  pixels: Pixel[][],
  area: SelectedArea
): Pixel[][] {
  const newPixels = pixels.map((row) => [...row]);
  for (let row = area.startRow; row <= area.endRow; row++) {
    if (!newPixels[row]) newPixels[row] = [];
    const baseRow = [...(newPixels[row] ?? [])];
    for (let col = area.startCol; col <= area.endCol; col++) {
      const pixel = pixels[row]?.[col];
      const isDisabled = pixel?.disabled;
      const mirrorCol = area.startCol + (area.endCol - col);
      const mirrorPixel = pixels[row]?.[mirrorCol];
      const mirrorIsDisabled = mirrorPixel?.disabled;

      if (isDisabled) {
        baseRow[col] = pixel;
      } else if (mirrorIsDisabled) {
        baseRow[col] = createEmptyPixel(row, col);
      } else {
        if (mirrorPixel) {
          baseRow[col] = {
            ...mirrorPixel,
            columnIndex: col,
          };
        } else {
          baseRow[col] = createEmptyPixel(row, col);
        }
      }
    }
    newPixels[row] = baseRow;
  }
  return newPixels;
}

export function flipPixelsVertical(
  pixels: Pixel[][],
  area: SelectedArea
): Pixel[][] {
  const newPixels = pixels.map((row) => [...row]);
  for (let col = area.startCol; col <= area.endCol; col++) {
    for (let row = area.startRow; row <= area.endRow; row++) {
      if (!newPixels[row]) newPixels[row] = [];
      const pixel = pixels[row]?.[col];
      const isDisabled = pixel?.disabled;
      const mirrorRow = area.startRow + (area.endRow - row);
      const mirrorPixel = pixels[mirrorRow]?.[col];
      const mirrorIsDisabled = mirrorPixel?.disabled;

      if (isDisabled) {
        newPixels[row]![col] = pixel;
      } else if (mirrorIsDisabled) {
        newPixels[row]![col] = createEmptyPixel(row, col);
      } else {
        if (mirrorPixel) {
          newPixels[row]![col] = {
            ...mirrorPixel,
            rowIndex: row,
            columnIndex: col,
          };
        } else {
          newPixels[row]![col] = createEmptyPixel(row, col);
        }
      }
    }
  }
  return newPixels;
}
