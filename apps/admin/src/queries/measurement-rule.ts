import { queryOptions } from "@tanstack/react-query";

import {
  getMeasurementRuleItemCode,
  GetMeasurementRuleItemCodeResponse,
  getMeasurementRuleList,
  GetMeasurementRuleListResponse,
} from "@/services/measurement-rule";

const getMeasurementRuleItemCodeQueryOptions = () => {
  return queryOptions<GetMeasurementRuleItemCodeResponse[]>({
    queryKey: ["measurement-rule-item-code"],
    queryFn: () => getMeasurementRuleItemCode(),
  });
};

const getMeasurementRuleListQueryOptions = () => {
  return queryOptions<GetMeasurementRuleListResponse>({
    queryKey: ["measurement-rule", "list"],
    queryFn: () => getMeasurementRuleList(),
  });
};

export const measurementRuleQueries = {
  getMeasurementRuleItemCodeQueryOptions,
  getMeasurementRuleListQueryOptions,
};
