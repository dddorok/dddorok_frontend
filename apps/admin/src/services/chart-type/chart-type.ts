import { privateInstance } from "../instance";

export interface CreateChartTypeRequest {
  name: string;
  svgFileUrl: string;
  points: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  mappings: Array<{
    measurement_code: string;
    start_point_id: string;
    end_point_id: string;
    symmetric: boolean;
    curve_type: "cubic" | "quadratic" | "linear";
    control_points: Array<{
      x: number;
      y: number;
    }>;
  }>;
}

export interface CreateChartTypeResponse {
  id: string;
  name: string;
  svgFileUrl: string;
  points: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  mappings: Array<{
    measurement_code: string;
    start_point_id: string;
    end_point_id: string;
    symmetric: boolean;
    curve_type: "cubic" | "quadratic" | "linear";
    control_points: Array<{
      x: number;
      y: number;
    }>;
  }>;
}

export const createChartType = async (data: CreateChartTypeRequest) => {
  const response = await privateInstance
    .post("chart-types", {
      json: data,
    })
    .json<{ data: CreateChartTypeResponse }>();
  return response.data;
};
