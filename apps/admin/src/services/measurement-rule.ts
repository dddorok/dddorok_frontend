// /api/measurement-rule/list

import { apiInstance, privateInstance } from "./instance";

export const getMeasurementRules = async () => {
  const response = await apiInstance("measurement-rule/list");
  return response.json();
};

// interface GetMeasurementRuleItemCodeRequest {
//   category: string;
// }

export interface GetMeasurementRuleItemCodeResponse {
  id: string;
  category: string;
  section: string;
  label: string;
  code: string;
}

export const getMeasurementRuleItemCode = async () => {
  const response = await privateInstance<{
    data: GetMeasurementRuleItemCodeResponse[];
  }>(`measurement-rule-item/code`);

  const data = await response.json();
  return data.data;
};

interface GetMeasurementRuleListItemType {
  id: string;
  rule_name: string;
  category_large: string;
  category_medium: string;
  category_small: string;
}

export interface GetMeasurementRuleListResponse {
  data: GetMeasurementRuleListItemType[];
}

export const getMeasurementRuleList = async () => {
  const response = await privateInstance<GetMeasurementRuleListResponse>(
    "measurement-rule/list"
  );
  return response.json();
};
