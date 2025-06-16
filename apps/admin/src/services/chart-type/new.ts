import { privateInstance } from "../instance";

export interface GetChartTypeSvgMappingResponse {
  svg_url: string;
  svg_name: string;
  mapped_path_id: {
    code: string;
    label: string;
    slider_default: boolean;
  }[];
  manual_mapped_path_id: {
    code: string;
    label: string;
    slider_default: boolean;
  }[];
}

export const getChartTypeSvgMapping = async (id: string) => {
  const response = await privateInstance
    .get<{
      data: GetChartTypeSvgMappingResponse;
    }>(`chart-type/${id}/svg-mapping`)
    .json();
  return response.data;
};

interface UpdateChartTypeSvgMappingRequest {
  name: string;
  svgFileUrl: string;
  points: {
    id: string;
    x: number;
    y: number;
  }[];
  mappings: {
    measurement_code: string;
    start_point_id: string;
    end_point_id: string;
    symmetric: boolean;
    curve_type: string;
    control_points: { x: number; y: number }[];
  }[];
}

export const updateChartTypeSvgMapping = async (
  id: string,
  data: UpdateChartTypeSvgMappingRequest
) => {
  const response = await privateInstance
    .patch<any>(`chart-type/${id}/svg-mapping`, { json: data })
    .json();
  return response;
};
