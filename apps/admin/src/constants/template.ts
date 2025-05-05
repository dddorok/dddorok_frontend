import { z } from "zod";

export const ChartTypeSchema = z.enum(["NARRATIVE", "GRID", "MIXED"], {
  required_error: "차트 유형을 선택해주세요",
});
export type ChartType = z.infer<typeof ChartTypeSchema> | "NONE";
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
  NONE: {
    label: "없음",
    value: "NONE",
  },
};
export const CHART_TYPE_OPTIONS = Object.values(CHART_TYPE);

export const NeedleTypeSchema = z.enum(["KNITTING", "CROCHET", "NONE"], {
  required_error: "바늘 종류를 선택해주세요",
});
export type NeedleType = z.infer<typeof NeedleTypeSchema> | "NONE";
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
    NONE: {
      label: "없음",
      value: "NONE",
    },
  };
export const NEEDLE_OPTIONS = Object.values(NEEDLE).filter(
  (needleType) => needleType.value !== "NONE"
);

export const ConstructionMethodSchema = z.enum([
  "TOP_DOWN",
  "BOTTOM_UP",
  "PIECED",
  "ROUND",
]);
export type ConstructionMethodType =
  | z.infer<typeof ConstructionMethodSchema>
  | "NONE";

export const CONSTRUCTION_METHOD: Record<
  ConstructionMethodType,
  { label: string; value: ConstructionMethodType }
> = {
  TOP_DOWN: { label: "탑다운", value: "TOP_DOWN" },
  BOTTOM_UP: { label: "바텀업", value: "BOTTOM_UP" },
  PIECED: { label: "조각잇기형", value: "PIECED" },
  ROUND: { label: "원통형", value: "ROUND" },
  NONE: { label: "없음", value: "NONE" },
};

export const CONSTRUCTION_METHOD_OPTIONS = Object.values(
  CONSTRUCTION_METHOD
).filter((constructionMethod) => constructionMethod.value !== "NONE");
