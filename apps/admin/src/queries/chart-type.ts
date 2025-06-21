import { queryOptions } from "@tanstack/react-query";

import {
  getChartType,
  getChartTypeList,
  type GetChartTypeResponse,
} from "@/services/chart-type";
import { getChartTypeSvgMapping } from "@/services/chart-type/new";

// 쿼리 키 정의
export const chartTypeQueryKeys = {
  all: () => ["chart-type"],
  list: () => [...chartTypeQueryKeys.all(), "list"],
  detail: (id: string) => [...chartTypeQueryKeys.all(), id],
  svgMapping: (id: string) => [...chartTypeQueryKeys.all(), id, "svg-mapping"],
};

// 쿼리 옵션 함수 정의
const chartTypeListQueryOptions = () => {
  return queryOptions({
    queryKey: chartTypeQueryKeys.list(),
    queryFn: getChartTypeList,
  });
};

const chartTypeQueryOptions = (id: string) => {
  return queryOptions<GetChartTypeResponse>({
    queryKey: chartTypeQueryKeys.detail(id),
    queryFn: () => getChartType(id),
  });
};

const chartTypeSvgMappingQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: chartTypeQueryKeys.svgMapping(id),
    queryFn: () => getChartTypeSvgMapping(id),
  });
};

// 쿼리 옵션 객체 내보내기
export const chartTypeQueries = {
  list: chartTypeListQueryOptions,
  detail: chartTypeQueryOptions,
  svgMapping: chartTypeSvgMappingQueryOptions,
};
