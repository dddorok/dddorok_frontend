import { privateInstance } from "./instance";

interface CreateProjectRequest {
  name: string;
  template_id: string;
  gauge_ko: number;
  gauge_dan: number;
  measurement_codes: {
    measurement_code: string;
    value: number;
  }[];
}

export const createProject = async (request: CreateProjectRequest) => {
  const response = await privateInstance
    .post("project", {
      json: request,
    })
    .json();
  return response;
};

export interface MyProjectItemType {
  id: string;
  name: string;
  created_date: string;
  updated_date: string;
  chart_list: {
    chart_id: string;
    name: string;
  }[];
}

export const getMyProjectList = async () => {
  const response = await privateInstance
    .get<{ data: MyProjectItemType[] }>("project/my-project/list")
    .json();
  return response;
};

export interface GetProjectResponse {
  id: string;
  name: string;
  created_date: string;
  chart_list: {
    chart_id: string;
    name: string;
  }[];
}

export const getProject = async (id: string) => {
  const response = await privateInstance
    .get<{ data: GetProjectResponse }>(`project/${id}`)
    .json();
  return response.data;
};

export interface GetChartResponse {
  id: string;
  chartTypeId: string;
  name: string;
  section: string;
  detailType: string;
  gridRow: number;
  gridCol: number;
  cells: {
    row: number;
    col: number;
    symbol: string;
    color_code: string;
  }[];
}

export const getChart = async (id: string) => {
  const response = await privateInstance
    .get(`project/chart/${id}`)
    .json<GetChartResponse>();
  return response;
};
