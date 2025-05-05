import { z } from "zod";

export const SleeveTypeSchema = z.enum([
  "RAGLAN",
  "SET_IN",
  "DROP",
  "SADDLE",
  "YOKE",
  "VEST",
  "NONE",
]);
export type SleeveType = z.infer<typeof SleeveTypeSchema>;

export const NecklineTypeSchema = z.enum([
  "ROUND_NECK",
  "V_NECK",
  "U_NECK",
  "SQUARE_NECK",
  "TURTLE_NECK",
  "NONE",
]);
export type NecklineType = z.infer<typeof NecklineTypeSchema>;

export const SLEEVE: Record<SleeveType, { label: string; value: SleeveType }> =
  {
    RAGLAN: { label: "래글런형", value: "RAGLAN" },
    SET_IN: { label: "셋인형", value: "SET_IN" },
    DROP: { label: "드롭숄더형", value: "DROP" },
    SADDLE: { label: "새들숄더형", value: "SADDLE" },
    YOKE: { label: "요크형", value: "YOKE" },
    VEST: { label: "베스트형", value: "VEST" },
    NONE: { label: "없음", value: "NONE" },
  };

export const NECKLINE: Record<
  NecklineType,
  { label: string; value: NecklineType }
> = {
  ROUND_NECK: { label: "라운드넥", value: "ROUND_NECK" },
  V_NECK: { label: "브이넥", value: "V_NECK" },
  U_NECK: { label: "유넥", value: "U_NECK" },
  SQUARE_NECK: { label: "스퀘어넥", value: "SQUARE_NECK" },
  TURTLE_NECK: { label: "터틀넥", value: "TURTLE_NECK" },
  NONE: { label: "해당없음", value: "NONE" },
};

export const SLEEVE_OPTIONS = Object.values(SLEEVE);
export const NECKLINE_OPTIONS = Object.values(NECKLINE);
