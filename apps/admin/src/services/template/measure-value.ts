import { privateInstance } from "../instance";

export interface TemplateMeasurementValuesItemCore {
  id: string;
  size_50_53: number | null;
  size_54_57: number | null;
  size_58_61: number | null;
  size_62_65: number | null;
  size_66_69: number | null;
  size_70_73: number | null;
  size_74_79: number | null;
  size_80_84: number | null;
  size_85_89: number | null;
  size_90_94: number | null;
  size_95_99: number | null;
  size_100_104: number | null;
  size_105_109: number | null;
  size_110_114: number | null;
  size_115_120: number | null;
  size_121_129: number | null;
  min: number | null;
  max: number | null;
  range_toggle: boolean;
}

export interface GetTemplateMeasurementValuesItemType
  extends TemplateMeasurementValuesItemCore {
  template_id: string;
  measurement_item_id: string;
  code: string;
  label: string;
}

export type GetTemplateMeasurementValuesResponse =
  GetTemplateMeasurementValuesItemType[];

export const getTemplateMeasurementValues = async (
  templateId: string
): Promise<GetTemplateMeasurementValuesResponse> => {
  const response = await privateInstance
    .get<{
      data: GetTemplateMeasurementValuesResponse;
    }>(`template/${templateId}/measurement-value`)
    .json();
  return response.data;
};

export interface TemplateMeasurementValueType
  extends TemplateMeasurementValuesItemCore {}

type UpdateTemplateMeasurementValuesRequest = TemplateMeasurementValueType[];

// 템플릿 세브 치수 값 생성
export const updateTemplateMeasurementValues = async (
  templateId: string,
  measurementValues: UpdateTemplateMeasurementValuesRequest
) => {
  const response = await privateInstance.patch(
    `template/${templateId}/measurement-value`,
    {
      json: measurementValues,
    }
  );
  return response.json();
};
