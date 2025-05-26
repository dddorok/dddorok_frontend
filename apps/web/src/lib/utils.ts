import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { colors } from "../../style/color";
import { fontSize } from "../../style/typo";

type FontSizeStyle = {
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
};

// typo.ts에서 폰트 크기와 폰트 웨이트 키 추출
const fontSizes = Object.keys(fontSize);
const fontWeights = Array.from(
  new Set(
    Object.values(fontSize)
      .map(([_, style]: [string, FontSizeStyle]) => style.fontWeight)
      .filter((weight): weight is string => weight !== undefined)
  )
);

// color.ts에서 색상 키 추출
const colorKeys = Object.entries(colors).reduce<string[]>(
  (acc, [category, values]) => {
    if (values && typeof values === "object") {
      Object.keys(values).forEach((key) => {
        acc.push(`${category}-${key}`);
      });
    }
    return acc;
  },
  []
);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: fontSizes }],
      "font-weight": [{ font: fontWeights }],
      "text-color": [{ text: colorKeys }],
      "bg-color": [{ bg: colorKeys }],
      "border-color": [{ border: colorKeys }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
