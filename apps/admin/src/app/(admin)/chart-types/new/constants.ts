import { z } from "zod";

export const SECTION_TYPE = ["BODY", "SLEEVE"] as const;
export const ChartSectionSchema = z.enum(SECTION_TYPE);
export type SectionType = z.infer<typeof ChartSectionSchema>;

export const BODY_DETAIL_TYPE = [
  "FRONT_BODY",
  "BACK_BODY",
  "UPPER_EXPANDED_VIEW",
  "LOWER_EXPANDED_VIEW",
] as const;

export const RETAIL_DETAIL_TYPE = [
  "RAGLAN_SLEEVE",
  "TOP_DOWN_SLEEVE",
  "SET_IN_SLEEVE",
] as const;

export const BodyDetailSchema = z.enum(BODY_DETAIL_TYPE);
export type BodyDetailType = z.infer<typeof BodyDetailSchema>;

export const RetailDetailSchema = z.enum(RETAIL_DETAIL_TYPE);
export type RetailDetailType = z.infer<typeof RetailDetailSchema>;

export const BODY_DETAIL: Record<
  BodyDetailType,
  { label: string; value: string }
> = {
  FRONT_BODY: { label: "앞몸판", value: "FRONT_BODY" },
  BACK_BODY: { label: "뒷몸판", value: "BACK_BODY" },
  UPPER_EXPANDED_VIEW: {
    label: "상단 전개도",
    value: "UPPER_EXPANDED_VIEW",
  },
  LOWER_EXPANDED_VIEW: {
    label: "하단 전개도",
    value: "LOWER_EXPANDED_VIEW",
  },
};

export const RETAIL_DETAIL: Record<
  RetailDetailType,
  { label: string; value: string }
> = {
  RAGLAN_SLEEVE: { label: "레글런 소매", value: "RAGLAN_SLEEVE" },
  TOP_DOWN_SLEEVE: { label: "탑 다운 소매", value: "TOP_DOWN_SLEEVE" },
  SET_IN_SLEEVE: { label: "세트인 소매", value: "SET_IN_SLEEVE" },
};

export const MEASUREMENT = {
  BODY_SHOULDER_WIDTH: {
    부위: "몸통",
    속성: "어깨",
    측정_유형: "너비",
    측정_항목: "어깨 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_AH_W: {
    부위: "몸통",
    속성: "진동",
    측정_유형: "너비",
    측정_항목: "진동 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "가슴너비-어깨너비",
  },
  BD_CH_W: {
    부위: "몸통",
    속성: "가슴",
    측정_유형: "너비",
    측정_항목: "가슴 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BODY_WAIST_WIDTH: {
    부위: "몸통",
    속성: "허리",
    측정_유형: "너비",
    측정_항목: "허리 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_UAH_W: {
    부위: "몸통",
    속성: "진동하단",
    측정_유형: "너비",
    측정_항목: "진동하단 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_NK_C: {
    부위: "몸통",
    속성: "목",
    측정_유형: "둘레",
    측정_항목: "목 둘레",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_CH_C: {
    부위: "몸통",
    속성: "가슴",
    측정_유형: "둘레",
    측정_항목: "가슴 둘레",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  SL_SCP_L: {
    부위: "소매",
    속성: "소매산",
    측정_유형: "길이",
    측정_항목: "소매산 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "0",
  },
  BD_ALL_L: {
    부위: "몸통",
    속성: "전체",
    측정_유형: "길이",
    측정_항목: "총장",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "0",
  },
  SL_ALL_W: {
    부위: "소매",
    속성: "전체",
    측정_유형: "너비",
    측정_항목: "소매너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_SHL_L: {
    부위: "몸통",
    속성: "어깨경사",
    측정_유형: "길이",
    측정_항목: "어깨경사 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_FNK_L: {
    부위: "몸통",
    속성: "앞목",
    측정_유형: "길이",
    측정_항목: "앞목 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_BNK_L: {
    부위: "몸통",
    속성: "뒷목",
    측정_유형: "길이",
    측정_항목: "뒷목 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_AH_L: {
    부위: "몸통",
    속성: "진동",
    측정_유형: "길이",
    측정_항목: "진동 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_FAH_L: {
    부위: "몸통",
    속성: "앞진동",
    측정_유형: "길이",
    측정_항목: "앞진동 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_BAH_L: {
    부위: "몸통",
    속성: "뒤진동",
    측정_유형: "길이",
    측정_항목: "뒤진동 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_WST_L: {
    부위: "몸통",
    속성: "허리",
    측정_유형: "길이",
    측정_항목: "허리 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_RG_L: {
    부위: "몸통",
    속성: "래글런",
    측정_유형: "길이",
    측정_항목: "래글런 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_BN_L: {
    부위: "몸통",
    속성: "고무단",
    측정_유형: "길이",
    측정_항목: "고무단 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_SHL_W: {
    부위: "몸통",
    속성: "어깨경사",
    측정_유형: "너비",
    측정_항목: "어깨사선 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "0",
  },
  BD_FNK_W: {
    부위: "몸통",
    속성: "앞목",
    측정_유형: "너비",
    측정_항목: "앞목 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_BNK_W: {
    부위: "몸통",
    속성: "뒷목",
    측정_유형: "너비",
    측정_항목: "뒷목 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_BN_W: {
    부위: "몸통",
    속성: "고무단",
    측정_유형: "너비",
    측정_항목: "고무단 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_FNK_C: {
    부위: "몸통",
    속성: "앞목",
    측정_유형: "둘레",
    측정_항목: "앞목 둘레",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_BNK_C: {
    부위: "몸통",
    속성: "뒷목",
    측정_유형: "둘레",
    측정_항목: "뒷목 둘레",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  BD_NB_L: {
    부위: "몸통",
    속성: "넥밴드",
    측정_유형: "길이",
    측정_항목: "넥밴드 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  SLEEVE_FRONT_ARM_HOLE_LENGTH: {
    부위: "소매",
    속성: "앞진동",
    측정_유형: "길이",
    측정_항목: "소매 앞진동 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  SL_BAH_L: {
    부위: "소매",
    속성: "뒤진동",
    측정_유형: "길이",
    측정_항목: "소매 뒤진동 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  SL_RG_L: {
    부위: "소매",
    속성: "래글런",
    측정_유형: "길이",
    측정_항목: "소매 래글런 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "0",
  },
  SL_BN_L: {
    부위: "소매",
    속성: "고무단",
    측정_유형: "길이",
    측정_항목: "소매 고무단 길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  SL_SCP_W: {
    부위: "소매",
    속성: "소매산",
    측정_유형: "너비",
    측정_항목: "소매산 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  SL_BN_W: {
    부위: "소매",
    속성: "고무단",
    측정_유형: "너비",
    측정_항목: "소매 고무단 너비",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  SL_SH_C: {
    부위: "몸통",
    속성: "어깨",
    측정_유형: "둘레",
    측정_항목: "소매 어깨 둘레",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
  SL_ALL_L: {
    부위: "소매",
    속성: "전체",
    측정_유형: "길이",
    측정_항목: "소매길이",
    SVG_매핑: "FALSE",
    조정_여부: "FALSE",
    자동계산: "FALSE",
  },
} as const;

export type Measurement = keyof typeof MEASUREMENT;

export const GROUPPING_MEASUREMENT = Object.entries(MEASUREMENT).reduce(
  (acc, [key, value]) => {
    const { 부위 } = value;
    if (!acc[부위]) {
      acc[부위] = [];
    }
    acc[부위].push(key as Measurement);
    return acc;
  },
  {} as Record<string, Measurement[]>
);
