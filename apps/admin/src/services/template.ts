import { privateInstance } from "./instance";

import { ChartType, NeedleType } from "@/constants/template";

export interface TemplateType {
  id: string;
  name: string;
  needle_type: string;
  pattern_type: string;
  construction_methods: string[];
  is_published: boolean;
  measurement_rule_id: string;
  chart_types: string[];
}

export type GetTemplatesResponse = TemplateType[];

export const getTemplates = async () => {
  const response = await privateInstance
    .get("template")
    .json<{ data: GetTemplatesResponse }>();
  return response.data;
};

interface CreateTemplateRequest {
  name: string;
  needle_type: NeedleType;
  chart_type: ChartType;
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
