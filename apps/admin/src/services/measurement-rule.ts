// /api/measurement-rule/list

import { apiInstance } from "./instance";

export const getMeasurementRules = async () => {
  const response = await apiInstance("measurement-rule/list");
  return response.json();
};

///api/measurement-rule-item/code

export const getMeasurementRuleItemCode = async ({
  category,
}: {
  category: string;
}) => {
  const response = await apiInstance(
    `measurement-rule-item/code?category=${category}`
  );
  return response.json();
};
