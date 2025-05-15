import { queryOptions } from "@tanstack/react-query";

import {
  getChartType,
  getChartTypeList,
  type GetChartTypeResponse,
} from "@/services/chart-type";

// 쿼리 키 정의
export const chartTypeQueryKeys = {
  all: () => ["chart-type"],
  list: () => [...chartTypeQueryKeys.all(), "list"],
  detail: (id: string) => [...chartTypeQueryKeys.all(), id],
};

// 쿼리 옵션 함수 정의
const getChartTypeListQueryOptions = () => {
  return queryOptions({
    queryKey: chartTypeQueryKeys.list(),
    queryFn: getChartTypeList,
  });
};

const getChartTypeQueryOptions = (id: string) => {
  return queryOptions<GetChartTypeResponse>({
    queryKey: chartTypeQueryKeys.detail(id),
    queryFn: () => getChartType(id),
  });
};

// 쿼리 옵션 객체 내보내기
export const chartTypeQueries = {
  getChartTypeListQueryOptions,
  getChartTypeQueryOptions,
};
