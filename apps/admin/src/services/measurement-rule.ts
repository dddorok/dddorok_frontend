// /api/measurement-rule/list

import { apiInstance, privateInstance } from "./instance";

export const getMeasurementRules = async () => {
  const response = await apiInstance("measurement-rule/list");
  return response.json();
};

interface GetMeasurementRuleItemCodeRequest {
  category: string;
}

interface GetMeasurementRuleItemCodeResponse {
  id: string;
  category: string;
  section: string;
  label: string;
  code: string;
}

export const getMeasurementRuleItemCode = async ({
  category,
}: GetMeasurementRuleItemCodeRequest) => {
  const response = await privateInstance<{
    data: GetMeasurementRuleItemCodeResponse[];
  }>(`measurement-rule-item/code`);

  const data = await response.json();
  return data.data;
};
