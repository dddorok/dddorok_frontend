import { queryOptions } from "@tanstack/react-query";

import {
  getMeasurementRuleItemCode,
  GetMeasurementRuleItemCodeResponse,
} from "@/services/measurement-rule";

const getMeasurementRuleItemCodeQueryOptions = () => {
  return queryOptions<GetMeasurementRuleItemCodeResponse[]>({
    queryKey: ["measurement-rule-item-code"],
    queryFn: () => getMeasurementRuleItemCode(),
  });
};

export const measurementRuleQueries = {
  getMeasurementRuleItemCodeQueryOptions,
};
