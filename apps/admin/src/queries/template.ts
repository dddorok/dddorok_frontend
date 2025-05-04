import { queryOptions } from "@tanstack/react-query";

import { getTemplates, GetTemplatesResponse } from "@/services/template";

const getTemplatesQueryOptions = () => {
  return queryOptions<GetTemplatesResponse>({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });
};

export const templateQueries = {
  getTemplatesQueryOptions,
};
