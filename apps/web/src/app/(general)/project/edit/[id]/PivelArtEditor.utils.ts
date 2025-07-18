import { Pixel } from "./utils/pixelUtils";

import { OriginalCell } from "@/services/project";

export const convertSubmitData = (
  pixels: (Pixel | null)[][]
): OriginalCell[] => {
  return pixels
    .map((row) =>
      row
        .filter((pixel) => pixel !== null && !pixel.disabled)
        .filter((pixel) => pixel !== null)
        .map((pixel) => ({
          row: pixel.rowIndex,
          col: pixel.columnIndex,
          symbol: pixel.shape?.id,
          color_code: pixel.shape?.color,
        }))
        .flat()
    )
    .flat();
};
