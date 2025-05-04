export type ChartType = "NARRATIVE" | "GRID" | "MIXED";
export const CHART_TYPE: Record<
  ChartType,
  { label: string; value: ChartType }
> = {
  NARRATIVE: {
    label: "서술형",
    value: "NARRATIVE",
  },
  GRID: {
    label: "차트형",
    value: "GRID",
  },
  MIXED: {
    label: "혼합형",
    value: "MIXED",
  },
};
export const CHART_TYPE_OPTIONS = Object.values(CHART_TYPE);

export type NeedleType = "KNITTING" | "CROCHET";
export const NEEDLE: Record<NeedleType, { label: string; value: NeedleType }> =
  {
    KNITTING: {
      label: "대바늘",
      value: "KNITTING",
    },
    CROCHET: {
      label: "코바늘",
      value: "CROCHET",
    },
  };
export const NEEDLE_OPTIONS = Object.values(NEEDLE);

// TOP_DOWN, BOTTOM_UP, PIECED, ROUND, NONE
export type ConstructionMethodType =
  | "TOP_DOWN"
  | "BOTTOM_UP"
  | "PIECED"
  | "ROUND";

export const CONSTRUCTION_METHOD: Record<
  ConstructionMethodType,
  { label: string; value: ConstructionMethodType }
> = {
  TOP_DOWN: { label: "탑다운", value: "TOP_DOWN" },
  BOTTOM_UP: { label: "바텀업", value: "BOTTOM_UP" },
  PIECED: { label: "조각잇기형", value: "PIECED" },
  ROUND: { label: "원통형", value: "ROUND" },
};

export const CONSTRUCTION_METHOD_OPTIONS = Object.values(CONSTRUCTION_METHOD);
