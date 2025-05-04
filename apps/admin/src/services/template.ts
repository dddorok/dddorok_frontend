// /api/template
// "data": [
//     {
//       "id": "91c37f8c-ce95-4099-a62e-441b7fde4243",
//       "name": "테스트 2",
//       "needle_type": "BIG_NEEDLE",
//       "pattern_type": "NARRATIVE",
//       "construction_methods": [
//         "TOP_DOWN"
//       ],
//       "is_published": false,
//       "measurement_rule_id": "7589e201-065c-440b-9bdb-63346329168d",
//       "chart_types": []
//     },
//     {
//       "id": "de487620-7b9b-4871-81cc-ef03b8089cad",
//       "name": "테스트 템플릿",
//       "needle_type": "BIG_NEEDLE",
//       "pattern_type": "MIXED",
//       "construction_methods": [
//         "BOTTOM_UP",
//         "PIECED"
//       ],
//       "is_published": false,
//       "measurement_rule_id": "7589e201-065c-440b-9bdb-63346329168d",
//       "chart_types": []
//     }
//   ]

import { privateInstance } from "./instance";

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
