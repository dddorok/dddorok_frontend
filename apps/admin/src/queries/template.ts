import { queryOptions } from "@tanstack/react-query";

import {
  getTemplateById,
  GetTemplateByIdResponse,
  getTemplates,
  GetTemplatesResponse,
} from "@/services/template";

export const templateQueryKeys = {
  all: () => ["templates"],
  templates: () => [...templateQueryKeys.all(), "list"],
  templateById: (templateId: string) => [
    ...templateQueryKeys.all(),
    templateId,
  ],
};

const getTemplatesQueryOptions = () => {
  return queryOptions<GetTemplatesResponse>({
    queryKey: templateQueryKeys.templates(),
    queryFn: getTemplates,
  });
};

const getTemplateByIdQueryOptions = (templateId: string) => {
  return queryOptions<GetTemplateByIdResponse>({
    queryKey: templateQueryKeys.templateById(templateId),
    queryFn: () => getTemplateById(templateId),
  });
};

export const templateQueries = {
  getTemplatesQueryOptions,
  getTemplateByIdQueryOptions,
};
