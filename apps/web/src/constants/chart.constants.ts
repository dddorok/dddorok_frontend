export const CHART_VALUE_TYPES = ["WIDTH", "LENGTH"] as const;
export type ChartValueType = (typeof CHART_VALUE_TYPES)[number];
export const CHART_VALUE_TYPE_OBJ: Record<
  ChartValueType,
  { label: string; value: string }
> = {
  WIDTH: {
    label: "너비",
    value: "width",
  },
  LENGTH: {
    label: "길이",
    value: "length",
  },
} as const;
