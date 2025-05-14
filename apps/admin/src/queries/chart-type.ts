import { queryOptions } from "@tanstack/react-query";

import { getChartTypeList } from "@/services/chart-type";

// 쿼리 키 정의
export const chartTypeQueryKeys = {
  all: () => ["chart-type"],
  list: () => [...chartTypeQueryKeys.all(), "list"],
};

// 쿼리 옵션 함수 정의
const getChartTypeListQueryOptions = () => {
  return queryOptions({
    queryKey: chartTypeQueryKeys.list(),
    queryFn: getChartTypeList,
  });
};

// 쿼리 옵션 객체 내보내기
export const chartTypeQueries = {
  getChartTypeListQueryOptions,
};
