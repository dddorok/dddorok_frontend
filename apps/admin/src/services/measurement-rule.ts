// /api/measurement-rule/list

import { apiInstance } from "./instance";

export const getMeasurementRules = async () => {
  const response = await apiInstance("measurement-rule/list");
  return response.json();
};
