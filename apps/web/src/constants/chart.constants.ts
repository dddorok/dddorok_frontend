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

export const CHART_SECTIONS = ["SLEEVE", "BODY"] as const;
export type ChartSection = (typeof CHART_SECTIONS)[number];
export const CHART_SECTION_OBJ: Record<
  ChartSection,
  { label: string; value: string }
> = {
  SLEEVE: {
    label: "소매",
    value: "SLEEVE",
  },
  BODY: {
    label: "몸판",
    value: "BODY",
  },
} as const;
