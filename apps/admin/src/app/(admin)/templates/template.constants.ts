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
