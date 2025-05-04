export type SizeRangeType =
  | "size_50_53"
  | "size_54_57"
  | "size_58_61"
  | "size_62_65"
  | "size_66_69"
  | "size_70_73"
  | "size_74_79"
  | "size_80_84"
  | "size_85_89"
  | "size_90_94"
  | "size_95_99"
  | "size_100_104"
  | "size_105_109"
  | "size_110_114"
  | "size_115_120"
  | "size_121_129"
  | "min"
  | "max";

export const SIZE_RANGE_LABEL: Record<SizeRangeType, string> = {
  size_50_53: "50-53",
  size_54_57: "54-57",
  size_58_61: "58-61",
  size_62_65: "62-65",
  size_66_69: "66-69",
  size_70_73: "70-73",
  size_74_79: "74-79",
  size_80_84: "80-84",
  size_85_89: "85-89",
  size_90_94: "90-94",
  size_95_99: "95-99",
  size_100_104: "100-104",
  size_105_109: "105-109",
  size_110_114: "110-114",
  size_115_120: "115-120",
  size_121_129: "121-129",
  min: "min",
  max: "max",
};

export const SIZE_RANGE_KEYS: SizeRangeType[] = Object.keys(
  SIZE_RANGE_LABEL
) as SizeRangeType[];
