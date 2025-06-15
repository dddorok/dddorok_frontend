import { privateInstance } from "./instance";

interface CreateProjectRequest {
  name: string;
  template_id: string;
  gauge_ko: number;
  gauge_dan: number;
  charts: {
    id: string;
    name: string;
    category_large: string;
    category_medium: string;
    section: string;
    detail_type: string;
    measurement_codes: {
      measurement_code: string;
      value: number;
    }[];
  }[];
}

export const createProject = async (request: CreateProjectRequest) => {
  const response = await privateInstance
    .post("/projects", {
      json: request,
    })
    .json();
  return response;
};
