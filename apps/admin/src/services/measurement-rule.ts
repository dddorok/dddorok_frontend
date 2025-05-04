// /api/measurement-rule/list

import { apiInstance, privateInstance } from "./instance";

export const getMeasurementRules = async () => {
  const response = await apiInstance("measurement-rule/list");
  return response.json();
};

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

export interface GetMeasurementRuleListItemType {
  category_large: string;
  category_medium: string;
  category_small: string;
  id: string;
  measurement_item_count: number;
  neck_line_type?: string;
  rule_name: string;
  sleeve_type?: string;
  template_count: number;
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

interface CreateMeasurementRuleRequest {
  category_large: string;
  category_medium: string;
  category_small: string;
  sleeve_type?: string;
  neck_line_type?: string;
  rule_name: string;
  measurement_codes: string[];
}

interface CreateMeasurementRuleResponse {
  id: string;
  category_large: string;
  category_medium: string;
  category_small: string;
  sleeve_type: string;
  neck_line_type: string;
  rule_name: string;
  created_date: string;
  updated_date: string;
  items: {
    id: string;
    category: string;
    section: string;
    label: string;
    code: string;
  }[];
}

// 치수 규칙 및 항목 생성
export const createMeasurementRule = async (
  request: CreateMeasurementRuleRequest
) => {
  const response = await privateInstance<CreateMeasurementRuleResponse>(
    "measurement-rule",
    { json: request, method: "POST" }
  );
  return response.json();
};
