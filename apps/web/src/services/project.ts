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
