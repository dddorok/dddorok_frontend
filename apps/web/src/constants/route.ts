export const ROUTE = {
  HOME: "/",
  TEMPLATE: "/template",
  LOGIN: "/auth/login",
  JOIN: "/auth/join",
  PROJECT: {
    NEW: (templateId: string, name: string) =>
      `/project/new?templateId=${templateId}&name=${name}`,
  },
  PRICING: "/pricing",
  MYPAGE: {
    PROJECT: () => "/mypage/project",
  },
};
