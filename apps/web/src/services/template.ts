import { privateInstance } from "./instance";

export interface TemplateType {
  id: string;
  name: string;
  thumbnail_url: string | null;
  subscribe_type: string;
  category_small: string;
}

export interface GetTemplateListRequest {
  category_medium?: string;
  category_small?: string;
  pageSize?: string;
}

export interface GetTemplateListResponse {
  total: number;
  page: number;
  page_size: number;
  items: TemplateType[];
}

export const getTemplates = async (request: GetTemplateListRequest) => {
  const params = new URLSearchParams();
  if (request.category_medium) {
    params.set("category_medium", request.category_medium);
  }
  if (request.category_small) {
    params.set("category_small", request.category_small);
  }
  if (request.pageSize) {
    params.set("pageSize", request.pageSize);
  }

  const response = await privateInstance
    .get<{ data: GetTemplateListResponse }>("template/list", {
      searchParams: params,
    })
    .json();
  return response.data;
};

export interface MeasurementItemType {
  code: string;
  label: string;
  value: number;
  min: number;
  max: number;
  value_type: "WIDTH" | "LENGTH";
  range_toggle: boolean;
}

export type MeasurementType = [
  string,
  {
    code: string;
    label: string;
    value: number;
    min: number;
    max: number;
    value_type: "WIDTH" | "LENGTH";
  },
];

interface SvgMappingAutoType {
  measurement_code: string;
  start_point_id: string;
  end_point_id: string;
  slider_default: boolean;
  control_points?: {
    x: number;
    y: number;
  }[];
}

interface SvgMappingManualType {
  measurement_code: string;
  start_point_id: string;
  end_point_id: string;
  slider_default: boolean;
}

export interface SvgMappingControlType {
  code: string;
  label: string;
  control_start: string;
  control_end: string;
  original_control: string;
  value_type: "WIDTH" | "LENGTH";
  control: string;
}

export interface GetTemplateChartListResponse {
  template_id: string;
  chart_types: {
    svg_mapping: {
      chart_type_id: string;
      created_date: string;
      mappings: {
        auto: SvgMappingAutoType[];
        manual: SvgMappingManualType[];
        control: SvgMappingControlType[];
      };
      name: string;
      svg_file_url: string;
      updated_date: string;
    };
  }[];
  measurements: [string, MeasurementItemType][];
}

export const getTemplateChartList = async (
  templateId: string,
  chest_circumference: number
) => {
  const response = await privateInstance
    .get<{
      data: GetTemplateChartListResponse;
    }>(`template/${templateId}/chart-list`, {
      searchParams: {
        chest_circumference: chest_circumference.toString(),
      },
    })
    .json();
  return response.data;
};
