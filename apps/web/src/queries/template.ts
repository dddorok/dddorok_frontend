import { queryOptions } from "@tanstack/react-query";

import {
  getTemplates,
  getTemplateChartList,
  GetTemplateListRequest,
} from "@/services/template";

export const templateQueryKey = "template";

const templateListQueryOptions = (request: GetTemplateListRequest) =>
  queryOptions({
    queryKey: [templateQueryKey, "list", request],
    queryFn: () => getTemplates(request),
  });

const templateChartListQueryOptions = (
  templateId: string,
  chest_circumference: number
) =>
  queryOptions({
    queryKey: [templateQueryKey, "chartList", templateId, chest_circumference],
    queryFn: () => getTemplateChartList(templateId, chest_circumference),
  });

export const templateQueries = {
  list: templateListQueryOptions,
  chartList: templateChartListQueryOptions,
};
