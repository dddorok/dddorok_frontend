import { queryOptions } from "@tanstack/react-query";

import {
  getMeasurementRuleById,
  GetMeasurementRuleByIdResponse,
  getMeasurementRuleItemCode,
  GetMeasurementRuleItemCodeResponse,
  getMeasurementRuleList,
  GetMeasurementRuleListResponse,
} from "@/services/measurement-rule";

export const measurementRuleQueryKeys = {
  all: () => ["measurement-rule"],
  measurementRuleItemCode: () => ["measurement-rule-item-code"],
  measurementRuleList: () => ["measurement-rule", "list"],
  measurementRuleById: (id: string) => ["measurement-rule", id],
};

// 치수 규칙 항목 코드 조회
const getMeasurementRuleItemCodeQueryOptions = () => {
  return queryOptions<GetMeasurementRuleItemCodeResponse[]>({
    queryKey: measurementRuleQueryKeys.measurementRuleItemCode(),
    queryFn: () => getMeasurementRuleItemCode(),
  });
};

// 치수 규칙 목록 조회
const getMeasurementRuleListQueryOptions = () => {
  return queryOptions<GetMeasurementRuleListResponse>({
    queryKey: measurementRuleQueryKeys.measurementRuleList(),
    queryFn: () => getMeasurementRuleList(),
  });
};

// 치수 규칙 단일 조회
const getMeasurementRuleByIdQueryOptions = (id: string) => {
  return queryOptions<GetMeasurementRuleByIdResponse>({
    queryKey: measurementRuleQueryKeys.measurementRuleById(id),
    queryFn: () => getMeasurementRuleById(id),
  });
};

export const measurementRuleQueries = {
  getMeasurementRuleItemCodeQueryOptions,
  getMeasurementRuleListQueryOptions,
  getMeasurementRuleByIdQueryOptions,
};
