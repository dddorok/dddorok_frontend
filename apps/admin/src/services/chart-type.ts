import { apiInstance, privateInstance } from "./instance";

import { SectionType } from "@/app/(admin)/chart-types/new/constants";

export interface ChartTypeItemType {
  id: string;
  name: string;
  category_large: string;
  category_medium: string;
  section: string;
  detail_type: string;
  created_date: string;
  updated_date: string;
  svg_file_id: string;
  measurement_code_maps: {
    measurement_code: string;
    path_id: string;
  }[];
  template_count: number;
}

export const getChartTypeList = async () => {
  const response = await privateInstance
    .get<{ data: ChartTypeItemType[] }>("chart-type/list")
    .json();
  return response.data;
};

export const deleteChartType = async (id: string) => {
  const response = await privateInstance.delete(`chart-type/${id}`).json();
  return response;
};

export interface MeasurementCodeMap {
  measurement_code: string;
  path_id: string;
}

export interface GetChartTypeResponse {
  id: string;
  name: string;
  category_large: string;
  category_medium: string;
  section: SectionType;
  detail_type: string;
  created_date: string;
  updated_date: string;
  measurement_code_maps: MeasurementCodeMap[];
  templates: {
    id: string;
    name: string;
  }[];
  svg_file_url: string;
  svg_mapping: any;
}

export const getChartType = async (id: string) => {
  const response = await privateInstance
    .get<{ data: GetChartTypeResponse }>(`chart-type/${id}`)
    .json();
  return response.data;
};

interface CreateChartTypeRequest {
  section: "BODY" | "SLEEVE";
  detail_type: string;
  name: string;
  resource_id: string;
}

export const createChartType = async (request: CreateChartTypeRequest) => {
  const response = await privateInstance
    .post<{
      data: {
        id: string;
      };
    }>(`chart-type`, { json: request })
    .json();
  return response.data;
};

///api/chart-type/upload-svg

export const uploadSvg = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log("FormData entries:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const response = await privateInstance
    .post<{
      data: {
        svg_url: string;
        svg_name: string;
        resource_id: string;
      };
    }>(`chart-type/upload-svg`, {
      body: formData,
    })
    .json();

  return response.data;
};

interface UpdateMeasurementCodeMapsRequest {
  id: string;
  measurement_code_maps: {
    measurement_code: string;
    path_id: string;
  }[];
}

export const updateMeasurementCodeMaps = async (
  request: UpdateMeasurementCodeMapsRequest
) => {
  const response = await privateInstance
    .patch(`chart-type/${request.id}/measurement-code-maps`, {
      json: {
        measurement_code_maps: request.measurement_code_maps,
      },
    })
    .json();
  return response;
};

interface UpdateChartTypeRequest {
  name: string;
  svgFileId: string;
  measurement_code_maps: MeasurementCodeMap[];
}

export const updateChartType = async (
  id: string,
  request: UpdateChartTypeRequest
) => {
  const response = await privateInstance
    .patch(`chart-type/${id}`, { json: request })
    .json();
  return response;
};
