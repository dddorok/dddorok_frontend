import { Pixel } from "./utils/pixelUtils";

import { OriginalCell } from "@/services/project";

export const convertSubmitData = (pixels: Pixel[][]): OriginalCell[] => {
  return pixels
    .map((row) =>
      row
        .filter((pixel) => !pixel.disabled)
        .filter((pixel) => pixel !== null)
        .map((pixel) => ({
          row: pixel.rowIndex,
          col: pixel.columnIndex,
          symbol: pixel.shape?.id,
          color_code: pixel.shape?.bgColor,
        }))
        .flat()
    )
    .flat();
};
