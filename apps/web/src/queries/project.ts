import { queryOptions } from "@tanstack/react-query";

import { getChart, getMyProjectList, getProject } from "@/services/project";

export const projectQueryKey = "project" as const;

const projectQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [projectQueryKey, id],
    queryFn: () => getProject(id),
  });

const myProjectListQueryOptions = () =>
  queryOptions({
    queryKey: [projectQueryKey, "my-project-list"],
    queryFn: () => getMyProjectList(),
  });

const chartQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [projectQueryKey, "chart", id],
    queryFn: () => getChart(id),
  });

export const projectQueries = {
  project: projectQueryOptions,
  myProjectList: myProjectListQueryOptions,
  chart: chartQueryOptions,
};
