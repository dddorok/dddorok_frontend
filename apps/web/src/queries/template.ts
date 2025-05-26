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

const templateChartListQueryOptions = (templateId: string) =>
  queryOptions({
    queryKey: [templateQueryKey, "chartList", templateId],
    queryFn: () => getTemplateChartList(templateId),
  });

export const templateQueries = {
  list: templateListQueryOptions,
  chartList: templateChartListQueryOptions,
};
