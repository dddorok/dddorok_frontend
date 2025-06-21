import { queryOptions } from "@tanstack/react-query";

import { getChart, getMyProjectList, getProject } from "@/services/project";

const projectQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
  });

const myProjectListQueryOptions = () =>
  queryOptions({
    queryKey: ["project", "my-project-list"],
    queryFn: () => getMyProjectList(),
  });

const chartQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["project", "chart", id],
    queryFn: () => getChart(id),
  });

export const projectQueries = {
  project: projectQueryOptions,
  myProjectList: myProjectListQueryOptions,
  chart: chartQueryOptions,
};
