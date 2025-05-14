import { privateInstance } from "../instance";

import {
  ChartType,
  ConstructionMethodType,
  NeedleType,
} from "@/constants/template";
import { NecklineType, SleeveType } from "@/constants/top";

export interface TemplateType {
  id: string;
  name: string;
  needle_type: NeedleType;
  chart_type: ChartType;
  construction_methods: ConstructionMethodType[];
  is_published: boolean;
  measurement_rule_id: string;
  chart_types: string[];
}

export type GetTemplatesResponse = TemplateType[];

export const getTemplates = async () => {
  const response = await privateInstance
    .get("template/list")
    .json<{ data: GetTemplatesResponse }>();
  return response.data;
};

interface CreateTemplateRequest {
  name: string;
  needle_type: NeedleType;
  chart_type: ChartType | "NONE";
  measurement_rule_id: string;
  construction_methods: string[];
  chart_type_ids: string[];
}

export const createTemplate = async (template: CreateTemplateRequest) => {
  const response = await privateInstance.post("template", {
    json: template,
  });
  return response.json();
};

export const deleteTemplate = async (templateId: string) => {
  const response = await privateInstance.delete(`template/${templateId}`);
  return response.json();
};

interface TemplateMeasurementRule {
  id: string;
  category_large: string;
  category_medium: string;
  category_small: string;
  sleeve_type: SleeveType;
  neck_line_type: NecklineType;
  rule_name: string;
  created_date: string;
  updated_date: string;
  items: {
    id: string;
    category: string;
    section: string;
    label: string;
  }[];
}

export interface GetTemplateByIdResponse {
  id: string;
  name: string;
  needle_type: NeedleType;
  chart_type: ChartType;
  is_published: boolean;
  construction_methods: ConstructionMethodType[];
  measurement_rule: TemplateMeasurementRule;
}
// 단일 템플릿 조회
export const getTemplateById = async (templateId: string) => {
  const response = await privateInstance
    .get<{ data: GetTemplateByIdResponse }>(`template/${templateId}`)
    .json();
  return response.data;
};

interface UpdateTemplateRequest {
  name: string;
  needle_type: NeedleType;
  chart_type: ChartType;
  construction_methods: ConstructionMethodType[];
  is_published: boolean;
  chart_type_ids?: string[];
}

export const updateTemplate = async (
  templateId: string,
  template: UpdateTemplateRequest
) => {
  const response = await privateInstance.patch(`template/${templateId}`, {
    json: template,
  });
  return response.json();
};

// 템플릿 게시/취소
export const updateTemplatePublishStatus = async (request: {
  template_id: string;
  is_published: boolean;
}): Promise<{
  id: "c7b3d7f0-8d6a-4c5d-98e6-678e9a34b7e9";
  is_published: true;
}> => {
  const response = await privateInstance.patch(
    `template/${request.template_id}/publish?is_published=${request.is_published}`
  );
  return response.json();
};
