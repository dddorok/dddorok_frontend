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
    .get<GetChartTypeSvgMappingResponse>(`chart-type/${id}/svg-mapping`)
    .json();
  return response;
};
