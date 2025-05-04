import { queryOptions } from "@tanstack/react-query";

import {
  getMeasurementRuleById,
  GetMeasurementRuleByIdResponse,
  getMeasurementRuleItemCode,
  GetMeasurementRuleItemCodeResponse,
  getMeasurementRuleList,
  GetMeasurementRuleListResponse,
} from "@/services/measurement-rule";

// 치수 규칙 항목 코드 조회
const getMeasurementRuleItemCodeQueryOptions = () => {
  return queryOptions<GetMeasurementRuleItemCodeResponse[]>({
    queryKey: ["measurement-rule-item-code"],
    queryFn: () => getMeasurementRuleItemCode(),
  });
};

// 치수 규칙 목록 조회
const getMeasurementRuleListQueryOptions = () => {
  return queryOptions<GetMeasurementRuleListResponse>({
    queryKey: ["measurement-rule", "list"],
    queryFn: () => getMeasurementRuleList(),
  });
};

// 치수 규칙 단일 조회
const getMeasurementRuleByIdQueryOptions = (id: string) => {
  return queryOptions<GetMeasurementRuleByIdResponse>({
    queryKey: ["measurement-rule", id],
    queryFn: () => getMeasurementRuleById(id),
  });
};

export const measurementRuleQueries = {
  getMeasurementRuleItemCodeQueryOptions,
  getMeasurementRuleListQueryOptions,
  getMeasurementRuleByIdQueryOptions,
};
