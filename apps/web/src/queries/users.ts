import { queryOptions } from "@tanstack/react-query";

import { getMyInfo } from "@/services/user";

export const userQuerKey = "users";

const myInfoQueryOptions = () =>
  queryOptions({
    queryKey: [userQuerKey, "my-info"],
    queryFn: getMyInfo,
  });

export const userQueries = {
  myInfo: myInfoQueryOptions,
};
