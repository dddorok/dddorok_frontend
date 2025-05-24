import { queryOptions } from "@tanstack/react-query";

import {
  getMeasurementRuleById,
  GetMeasurementRuleByIdResponse,
  getMeasurementRuleChartTypeList,
  GetMeasurementRuleChartTypeListItemType,
  getMeasurementRuleItemCode,
  GetMeasurementRuleItemCodeResponse,
  getMeasurementRuleList,
  GetMeasurementRuleListResponse,
  getMeasurementRuleTemplateList,
  GetMeasurementRuleTemplateListItemType,
} from "@/services/measurement-rule";

export const measurementRuleQueryKeys = {
  all: () => ["measurement-rule"],
  measurementRuleItemCode: () => ["measurement-rule-item-code"],
  measurementRuleList: () => ["measurement-rule", "list"],
  measurementRuleById: (id: string) => ["measurement-rule", id],
  measurementRuleTemplateList: (id: string) => [
    "measurement-rule",
    id,
    "template",
    "list",
  ],
  measurementRuleChartTypeList: (id: string) => [
    "measurement-rule",
    id,
    "chart-type",
    "list",
  ],
};

// 치수 규칙 항목 코드 조회
const itemCodeQueryOptions = () => {
  return queryOptions<GetMeasurementRuleItemCodeResponse[]>({
    queryKey: measurementRuleQueryKeys.measurementRuleItemCode(),
    queryFn: () => getMeasurementRuleItemCode(),
  });
};

// 치수 규칙 목록 조회
const listQueryOptions = () => {
  return queryOptions<GetMeasurementRuleListResponse>({
    queryKey: measurementRuleQueryKeys.measurementRuleList(),
    queryFn: () => getMeasurementRuleList(),
  });
};

// 치수 규칙 단일 조회
const ruleByIdQueryOptions = (id: string) => {
  return queryOptions<GetMeasurementRuleByIdResponse>({
    queryKey: measurementRuleQueryKeys.measurementRuleById(id),
    queryFn: () => getMeasurementRuleById(id),
  });
};

// 치수 규칙 id로 템플릿 조회
const templateListByRuleIdQueryOptions = (id: string) => {
  return queryOptions<GetMeasurementRuleTemplateListItemType[]>({
    queryKey: measurementRuleQueryKeys.measurementRuleTemplateList(id),
    queryFn: () => getMeasurementRuleTemplateList(id),
  });
};

// 치수 규칙 id로 차트 타입 조회
const chartTypeListByRuleIdQueryOptions = (id: string) => {
  return queryOptions<GetMeasurementRuleChartTypeListItemType[]>({
    queryKey: measurementRuleQueryKeys.measurementRuleChartTypeList(id),
    queryFn: () => getMeasurementRuleChartTypeList(id),
  });
};

export const measurementRuleQueries = {
  itemCode: itemCodeQueryOptions,
  list: listQueryOptions,
  ruleById: ruleByIdQueryOptions,
  templateListByRuleId: templateListByRuleIdQueryOptions,
  chartTypeListByRuleId: chartTypeListByRuleIdQueryOptions,
};
