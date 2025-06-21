import { GetTemplateMeasurementValuesItemType } from "@/services/template/measure-value";

type ColumnHeaders = {
  [K in keyof GetTemplateMeasurementValuesItemType]: string;
};

// 편집 가능한 컬럼들
export const EDITABLE_COLUMNS: (keyof GetTemplateMeasurementValuesItemType)[] =
  [
    "size_50_53",
    "size_54_57",
    "size_58_61",
    "size_62_65",
    "size_66_69",
    "size_70_73",
    "size_74_79",
    "size_80_84",
    "size_85_89",
    "size_90_94",
    "size_95_99",
    "size_100_104",
    "size_105_109",
    "size_110_114",
    "size_115_120",
    "size_121_129",
    "min",
    "max",
  ];

// 컬럼 헤더 매핑
export const COLUMN_HEADERS: ColumnHeaders = {
  id: "ID",
  template_id: "Template ID",
  measurement_item_id: "Measurement Item ID",
  code: "Code",
  label: "항목",
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
  min: "Min",
  max: "Max",
  range_toggle: "Range",
};

export const getDefaultRow = (
  id: string
): GetTemplateMeasurementValuesItemType => {
  return {
    id: `new-${id}`,
    template_id: "",
    measurement_item_id: "",
    code: "",
    label: "",
    size_50_53: null,
    size_54_57: null,
    size_58_61: null,
    size_62_65: null,
    size_66_69: null,
    size_70_73: null,
    size_74_79: null,
    size_80_84: null,
    size_85_89: null,
    size_90_94: null,
    size_95_99: null,
    size_100_104: null,
    size_105_109: null,
    size_110_114: null,
    size_115_120: null,
    size_121_129: null,
    min: null,
    max: null,
    range_toggle: false,
  };
};
