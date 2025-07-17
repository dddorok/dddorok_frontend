export const ROUTE = {
  HOME: "/",
  TEMPLATE: "/template",
  LOGIN: "/auth/login",
  JOIN: "/auth/join",
  PROJECT: {
    NEW: (templateId: string, name: string) =>
      `/project/new?templateId=${templateId}&name=${name}`,
    EDIT: (projectId: string) => `/project/edit/${projectId}`,
  },
  PRICING: "/pricing",
  MYPAGE: {
    PROJECT: () => "/mypage/project",
  },
  POLICY: {
    TERMS: "/policy/terms",
    PRIVACY: "/policy/privacy",
  },
};
