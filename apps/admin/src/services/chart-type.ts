import { apiInstance, privateInstance } from "./instance";

interface ChartTypeItemType {
  id: string;
  name: string;
  category_large: string;
  category_medium: string;
  section: string;
  detail_type: string;
  created_date: string;
  updated_date: string;
  svg_file_id: string;
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
