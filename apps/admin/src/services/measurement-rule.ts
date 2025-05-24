import { privateInstance } from "./instance";

import {
  ChartType,
  ConstructionMethodType,
  NeedleType,
} from "@/constants/template";
import { NecklineType, SleeveType } from "@/constants/top";

export const getMeasurementRules = async () => {
  const response = await privateInstance("measurement-rule/list");
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
  neck_line_type?: NecklineType;
  rule_name: string;
  sleeve_type?: SleeveType;
  template_count: number;
  chart_count: number;
}

export interface GetMeasurementRuleListResponse {
  data: GetMeasurementRuleListItemType[];
}

// 치수 규칙 목록 조회
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
  sleeve_type?: SleeveType;
  neck_line_type?: NecklineType;
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
  const response = await privateInstance<{
    data: CreateMeasurementRuleResponse;
  }>("measurement-rule", { json: request, method: "POST" });
  return response.json();
};

export interface GetMeasurementRuleByIdResponse {
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
    ruleId: string;
    category: string;
    section: string;
    label: string;
    code: string;
  }[];
}
// 치수 규칙 단일 조회
export const getMeasurementRuleById = async (id: string) => {
  const response = await privateInstance<{
    data: GetMeasurementRuleByIdResponse;
  }>(`measurement-rule/${id}`);

  const data = await response.json();
  return data.data;
};

// 치수 규칙 삭제
export const deleteMeasurementRule = async (id: string) => {
  const response = await privateInstance(`measurement-rule/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

// 치수 규칙 수정
export const updateMeasurementRule = async (
  id: string,
  request: CreateMeasurementRuleRequest
) => {
  const response = await privateInstance(`measurement-rule/${id}`, {
    json: request,
    method: "PATCH",
  });
  return response.json();
};

export interface GetMeasurementRuleTemplateListItemType {
  id: string;
  name: string;
  needle_type: NeedleType;
  chart_type: ChartType;
  is_published: boolean;
  construction_methods: ConstructionMethodType[];
}

export interface GetMeasurementRuleTemplateListResponse {
  data: GetMeasurementRuleTemplateListItemType[];
}

// 치수 규칙 id로 템플릿 조회
export const getMeasurementRuleTemplateList = async (id: string) => {
  const response =
    await privateInstance<GetMeasurementRuleTemplateListResponse>(
      `measurement-rule/${id}/template/list`
    ).json();
  return response.data;
};

export interface GetMeasurementRuleChartTypeListItemType {
  id: string;
  name: string;
}

// 치수 규칙 id로 차트 타입 조회
export const getMeasurementRuleChartTypeList = async (id: string) => {
  const response = await privateInstance<{
    data: GetMeasurementRuleChartTypeListItemType[];
  }>(`measurement-rule/${id}/chart-type/list`).json();
  return response.data;
};
